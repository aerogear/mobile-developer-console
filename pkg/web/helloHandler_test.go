package web

import (
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
)

// Mock Hello Service
// Allows us to test the handler in isolation without pulling in the actual business logic
// Could also use mocking libraries but these are awkward to set up
type MockHelloService struct {
	ReturnError bool
}

var testApiPrefix = "/api"

func (hs MockHelloService) Hello(name string) (string, error) {
	if hs.ReturnError {
		return "", errors.New("Some internal error")
	}
	return "Hello World", nil
}

func setupHealthHandler(service HelloWorldable) *httptest.Server {
	router := NewRouter("", testApiPrefix)
	apiGroup := router.Group(testApiPrefix)
	helloHandler := NewHelloHandler(service)
	SetupHelloRoute(apiGroup, helloHandler)
	return httptest.NewServer(router)
}

func TestHelloEndpoint(t *testing.T) {
	helloService := MockHelloService{}
	server := setupHealthHandler(helloService)

	defer server.Close()

	res, err := http.Get(fmt.Sprintf("%s%s/hello", server.URL, testApiPrefix))

	if err != nil {
		t.Fatal("error requesting / endpoint")
	}

	if res.StatusCode != 200 {
		t.Fatal("/hello endpoint returned a non 200 response")
	}
}

func TestHelloEndpointWhenHelloServiceReturnsError(t *testing.T) {
	helloService := MockHelloService{ReturnError: true}
	server := setupHealthHandler(helloService)

	defer server.Close()

	res, err := http.Get(fmt.Sprintf("%s%s/hello", server.URL, testApiPrefix))

	if err != nil {
		t.Fatal("error requesting / endpoint")
	}

	if res.StatusCode != 500 {
		t.Fatal("/ endpoint returned a non 500 response")
	}
}
