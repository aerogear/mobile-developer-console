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

func SetupMobileServicesRoute(r *echo.Group, handler *MobileServiceInstancesHandler) {
	r.GET("/serviceinstances", handler.List)
}

func SetupMobileBuildsRoute(r *echo.Group, handler *MobileBuildsHandler) {
	r.GET("/builds", handler.List)
}

func SetupMobileBuildConfigsRoute(r *echo.Group, handler *MobileBuildConfigsHandler) {
	r.GET("/buildconfigs", handler.List)
}


// SetMobileClientRoutes sets routes for mobile clients
func SetMobileClientRoutes(router *echo.Group, handler *MobileResourceHandler) {
	router.GET("/mobileclients", func(context echo.Context) error {
		if context.QueryParam("watch") == "true" {
			return handler.watch(context, context.Param("resourceVersion"))
		}

		return handler.list(context)
	})
}

func SetupMoileClientsRoute(r *echo.Group, handler *MobileClientsHandler) {
	r.GET("/mobileclients", handler.List)
	r.POST("/mobileclients", handler.Create)
	r.POST("/mobileclients/:name", handler.Update)
	r.GET("/mobileclients/:name", handler.Read)
	r.DELETE("/mobileclients/:name", handler.Delete)
}
