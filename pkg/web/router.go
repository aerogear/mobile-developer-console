package web

import (
	"net/http"

	"github.com/gorilla/mux"
)

func NewRouter() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	router.Use(loggerMiddleWare)
	return router
}

func SetupHelloRoute(r *mux.Router, handler *helloHandler) {
	r.HandleFunc("/hello", handler.HelloEndpoint).Methods("GET")
}

func SetupStaticFilesRouter(r *mux.Router, staticFileDir string) {
	r.PathPrefix("/ui/").Handler(http.StripPrefix("/ui/", http.FileServer(http.Dir(staticFileDir))))
}
