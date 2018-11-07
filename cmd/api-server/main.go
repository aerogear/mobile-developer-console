package main

import (
	"flag"
	"net/http"
	"os"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"

	"github.com/aerogear/mobile-developer-console/pkg/config"
	"github.com/aerogear/mobile-developer-console/pkg/web"
	log "github.com/sirupsen/logrus"

	"github.com/aerogear/mobile-developer-console/pkg/stub"
	sc "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

var (
	kubeconfig string
	namespace  string
)

func main() {
	flag.Parse()

	config := config.GetConfig()
	staticFilesDir := config.StaticFilesDir
	apiRoutePrefix := config.ApiRoutePrefix

	initLogger(config.LogLevel, config.LogFormat)

	if namespace == "" {
		log.Fatalf("-namespace is a required flag or it can be set via NAMESPACE env var")
	}

	if os.Getenv("KUBERNETES_CONFIG") == "" {
		log.Warnf("KUBERNETES_CONFIG is not set. It is required if you are running the application outside of a kubernetes cluster.")
	}

	web.SetupWS(config.WsWriteWait, config.WsPongWait)

	router := web.NewRouter(staticFilesDir, apiRoutePrefix)
	apiGroup := router.Group(apiRoutePrefix)

	cfg, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	k8sClient, err := kubernetes.NewForConfig(cfg)
	if err != nil {
		log.Fatalf("Error init k8s client: %s", err.Error())
	}

	scClient, err := sc.NewForConfig(cfg)
	if err != nil {
		log.Fatalf("Error init service catalog client: %v", err)
	}

	mobileClientsRepo := mobile.NewMobileClientRepo(namespace)
	secretsCRUDL := mobile.NewSecretsCRUDL(k8sClient.CoreV1())
	{
		sbLister := mobile.NewServiceBindingLister(scClient.ServicecatalogV1beta1(), mobileClientsRepo, secretsCRUDL)
		mobileServicebindingsHandler := web.NewMobileServiceBindingsHandler(sbLister, namespace)
		web.SetupBindableMobileServiceRoute(apiGroup, mobileServicebindingsHandler)
	}
	{
		siLister := mobile.NewServiceInstanceLister(scClient.ServicecatalogV1beta1(), namespace)
		mobileServiceInstancesHandler := web.NewMobileServiceInstancesHandler(siLister, namespace)
		web.SetupMobileServicesRoute(apiGroup, mobileServiceInstancesHandler)
	}

	if config.BuildTabEnabled {
		buildClient, err := buildv1.NewForConfig(cfg)
		if err != nil {
			log.Fatalf("Error init build client: %v", err)
		}

		buildCRUDL := mobile.NewBuildCRUDL(buildClient, namespace, cfg.Host)

		mobileBuildsHandler := web.NewMobileBuildsHandler(buildCRUDL, namespace)
		web.SetupMobileBuildsRoute(apiGroup, mobileBuildsHandler)

		buildConfigCRUDL := mobile.NewBuildConfigCRUDL(buildClient, namespace)

		mobileBuildConfigsHandler := web.NewMobileBuildConfigsHandler(buildConfigCRUDL, secretsCRUDL, namespace)
		web.SetupMobileBuildConfigsRoute(apiGroup, mobileBuildConfigsHandler)
	}

	{
		mobileClientsHandler := web.NewMobileClientsHandler(mobileClientsRepo, namespace)
		web.SetupMoileClientsRoute(apiGroup, mobileClientsHandler)
	}

	userHandler := web.NewUserHandler()
	web.SetupUserRouter(apiGroup, userHandler)

	serverConfigHandler := web.NewServerConfigHandler(config)
	web.SetupServerConfigRouter(apiGroup, serverConfigHandler)

	getWatchInterface := secretsCRUDL.Watch(namespace)
	go stub.Watch(getWatchInterface, func() { stub.HandleSecretsChange(namespace, mobileClientsRepo, secretsCRUDL) })

	log.WithFields(log.Fields{"listenAddress": config.ListenAddress}).Info("Starting application")
	log.Fatal(http.ListenAndServe(config.ListenAddress, router))
}

func initLogger(level, format string) {
	logLevel, err := log.ParseLevel(level)

	if err != nil {
		log.Fatalf("log level %v is not allowed. Must be one of [debug, info, warning, error, fatal, panic]", level)
		logLevel = log.InfoLevel
	}

	log.SetLevel(logLevel)

	switch format {
	case "json":
		log.SetFormatter(&log.JSONFormatter{})
	case "text":
		log.SetFormatter(&log.TextFormatter{DisableColors: true})
	default:
		log.Fatalf("log format %v is not allowed. Must be one of [text, json]", format)
	}
}

func init() {
	flag.StringVar(&kubeconfig, "kubeconfig", os.Getenv("KUBERNETES_CONFIG"), "Path to a kubeconfig. Only required if out-of-cluster.")
	flag.StringVar(&namespace, "namespace", os.Getenv("NAMESPACE"), "Name space. Only required if out-of-cluster.")
}
