package web

import (
	"github.com/labstack/echo/middleware"
	"github.com/labstack/echo"
	"strings"
)

var ApiPrefix = "/api"

func NewRouter(fileDir string) *echo.Echo {
	router := echo.New()

	router.Use(middleware.Logger())
	router.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root: fileDir,
		HTML5: true,
		Index: "index.html",
		Skipper: func(context echo.Context) bool {
			// We don't want to return the SPA if any api/* is called, it should act like a normal API.
			return strings.HasPrefix(context.Request().URL.Path, ApiPrefix)
		},
		Browse: false,
	}))
	return router
}

func SetupHelloRoute(r *echo.Group, handler *helloHandler) {
	r.GET("/hello", handler.HelloEndpoint)
}