package web

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"gopkg.in/go-playground/validator.v9"
	"strings"
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
	r.GET("/serviceinstances/watch", handler.Watch)
}

func SetupMobileBuildsRoute(r *echo.Group, handler *MobileBuildsHandler) {
	r.GET("/builds", handler.List)
    r.GET("/builds/watch", handler.Watch)
	r.POST("/builds/:name/gendownloadurl", handler.GenerateDownloadURL)
}

func SetupMobileBuildConfigsRoute(r *echo.Group, handler *MobileBuildConfigsHandler) {
	r.GET("/buildconfigs", handler.List)
	r.POST("/buildconfigs", handler.Create)
	r.DELETE("/buildconfigs/:name", handler.Delete)
	r.POST("/buildconfigs/:name/instantiate", handler.Instantiate)
	r.GET("/buildconfigs/watch", handler.Watch)
}

// SetMobileClientRoutes sets routes for mobile clients
func SetupMoileClientsRoute(r *echo.Group, handler *MobileClientsHandler) {
	r.GET("/mobileclients", handler.List)
	r.POST("/mobileclients", handler.Create)
	r.POST("/mobileclients/:name", handler.Update)
	r.GET("/mobileclients/:name", handler.Read)
	r.DELETE("/mobileclients/:name", handler.Delete)
	r.GET("/mobileclients/watch", handler.Watch)
}

func SetupUserRouter(r *echo.Group, handler *UserHandler) {
	r.GET("/user", handler.GetUserInfo)
}

func SetupServerConfigRouter(r *echo.Group, handler *ServerConfigHandler) {
	r.GET("/server_config.js", handler.Handle)
}
