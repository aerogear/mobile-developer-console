package web

import (
	"net/http"

	"github.com/labstack/echo"
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

func (hh *helloHandler) HelloEndpoint(c echo.Context) error {
	name := c.QueryParam("name")

	result, err := hh.helloService.Hello(name)

	if err != nil {
		c.Logger().Infof("An error occurred retrieving the hello world message: %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	message := helloMessage{
		Message: result,
		Version: version,
	}
	return c.JSON(http.StatusOK, message)
}
