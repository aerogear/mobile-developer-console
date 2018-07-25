package web

import (
	"strings"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func NewRouter(fileDir string, apiRoutePrefix string) *echo.Echo {
	router := echo.New()

	router.Use(middleware.Logger())
	router.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  fileDir,
		HTML5: true,
		Index: "index.html",
		Skipper: func(context echo.Context) bool {
			// We don't want to return the SPA if any api/* is called, it should act like a normal API.
			return strings.HasPrefix(context.Request().URL.Path, apiRoutePrefix)
		},
		Browse: false,
	}))
	return router
}

func SetupHelloRoute(r *echo.Group, handler *helloHandler) {
	r.GET("/hello", handler.HelloEndpoint)
}
