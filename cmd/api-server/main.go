package main

import (
	"flag"
	"net/http"
	"os"

	"github.com/aerogear/mobile-client-service/pkg/mobile"

	"github.com/aerogear/mobile-client-service/pkg/config"
	"github.com/aerogear/mobile-client-service/pkg/web"
	log "github.com/sirupsen/logrus"

	"context"
	"github.com/aerogear/mobile-client-service/pkg/stub"
	sc "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	"github.com/operator-framework/operator-sdk/pkg/sdk"
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
		log.Fatalf("KUBERNETES_CONFIG is a required env var. Please set KUBERNETES_CONFIG to point to your kubeconfig file")
	}

	router := web.NewRouter(staticFilesDir, apiRoutePrefix)
	apiGroup := router.Group(apiRoutePrefix)

	cfg, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// k8sClient, err := kubernetes.NewForConfig(cfg)
	// if err != nil {
	// 	log.Fatalf("Error init k8s client: %s", err.Error())
	// }

	scClient, err := sc.NewForConfig(cfg)
	if err != nil {
		log.Fatalf("Error init service catalog client: %v", err)
	}

	buildClient, err := buildv1.NewForConfig(cfg)
	if err != nil {
		log.Fatalf("Error init build client: %v", err)
	}

	{
		siLister := mobile.NewServiceInstanceLister(scClient.ServicecatalogV1beta1())
		mobileServiceInstancesHandler := web.NewMobileServiceInstancesHandler(siLister, namespace)
		web.SetupMobileServicesRoute(apiGroup, mobileServiceInstancesHandler)
	}

	{
		buildLister := mobile.NewBuildLister(buildClient)
		mobileBuildsHandler := web.NewMobileBuildsHandler(buildLister, namespace)
		web.SetupMobileBuildsRoute(apiGroup, mobileBuildsHandler)
	}

	{
		buildConfigLister := mobile.NewBuildConfigLister(buildClient)
		mobileBuildConfigsHandler := web.NewMobileBuildConfigsHandler(buildConfigLister, namespace)
		web.SetupMobileBuildConfigsRoute(apiGroup, mobileBuildConfigsHandler)
	}

	{
		mobileClientsRepo := mobile.NewMobileClientRepo(namespace)
		mobileClientsHandler := web.NewMobileClientsHandler(mobileClientsRepo, namespace)
		web.SetupMoileClientsRoute(apiGroup, mobileClientsHandler)
	}

	resource := "v1"
	kind := "Secret"
	resyncPeriod := 5

	go func() {
		sdk.Watch(resource, kind, namespace, resyncPeriod)
		sdk.Handle(stub.NewHandler())
		sdk.Run(context.Background())
	}()

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
