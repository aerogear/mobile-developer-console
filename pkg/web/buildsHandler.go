package web

import (
	"net/http"

	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileBuildsHandler struct {
	namespace    string
	buildsLister mobile.BuildLister
}

func NewMobileBuildsHandler(buildsLister mobile.BuildLister, namespace string) *MobileBuildsHandler {
	return &MobileBuildsHandler{
		buildsLister: buildsLister,
		namespace:    namespace,
	}
}

func (mbh *MobileBuildsHandler) List(c echo.Context) error {
	builds, err := mbh.buildsLister.List(mbh.namespace)
	if err != nil {
		c.Logger().Errorf("error listing builds %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, builds)
}
