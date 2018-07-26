package main

import (
	"flag"
	"net/http"
	"os"

	"github.com/aerogear/mobile-client-service/pkg/mobile"

	"github.com/aerogear/mobile-client-service/pkg/config"
	"github.com/aerogear/mobile-client-service/pkg/web"
	log "github.com/sirupsen/logrus"

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

	router := web.NewRouter(staticFilesDir, apiRoutePrefix)
	apiGroup := router.Group(apiRoutePrefix)

	kubeClient, err := intKubeClient()
	if err != nil {
		log.Fatalf("Error init k8s client: %s", err.Error())
	}

	{
		serviceLister := mobile.NewServiceLister(kubeClient)
		mobileServiceHandler := web.NewMobileServiceHandler(serviceLister, namespace)
		web.SetupMobileServicesRoute(apiGroup, mobileServiceHandler)
	}

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

func intKubeClient() (*kubernetes.Clientset, error) {
	cfg, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		return nil, err
	}

	kubeClient, err := kubernetes.NewForConfig(cfg)
	if err != nil {
		return nil, err
	}

	return kubeClient, nil
}

func init() {
	flag.StringVar(&kubeconfig, "kubeconfig", "", "Path to a kubeconfig. Only required if out-of-cluster.")
	flag.StringVar(&namespace, "namespace", os.Getenv("NAMESPACE"), "Name space. Only required if out-of-cluster.")
}
