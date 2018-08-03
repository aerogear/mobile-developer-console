package web

import (
	"strings"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/go-playground/validator.v9"
)

type RequestValidator struct {
	validator *validator.Validate
}

func (v *RequestValidator) Validate(i interface{}) error {
	return v.validator.Struct(i)
}

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
	router.Validator = &RequestValidator{validator: validator.New()}
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
func SetupMoileClientsRoute(r *echo.Group, handler *MobileClientsHandler) {
	r.GET("/mobileclients", func(c echo.Context) error {
		if c.QueryParam("watch") == "true" {
			return handler.Watch(c)
		}
		return handler.List(c)
	})
	r.POST("/mobileclients", handler.Create)
	r.POST("/mobileclients/:name", handler.Update)
	r.GET("/mobileclients/:name", handler.Read)
	r.DELETE("/mobileclients/:name", handler.Delete)
}
