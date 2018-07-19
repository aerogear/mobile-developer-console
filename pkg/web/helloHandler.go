package web

import (
	"encoding/json"
	"net/http"
)

var version = "1.0.0" // quick and dirty for demos

type helloHandler struct {
	helloService HelloWorldable
}

type helloMessage struct {
	Message string `json:"message"`
	Version string `json:"version"`
}

func NewHelloHandler(helloService HelloWorldable) *helloHandler {
	return &helloHandler{
		helloService: helloService,
	}
}

func (hh *helloHandler) HelloEndpoint(w http.ResponseWriter, req *http.Request) {
	query := req.URL.Query()

	name := query.Get("name")

	result, err := hh.helloService.Hello(name)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	message := helloMessage{
		Message: result,
		Version: version,
	}

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(message)
}
