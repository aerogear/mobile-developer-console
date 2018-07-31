package web

import (
	"net/http"

	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileBuildConfigsHandler struct {
	namespace          string
	buildConfigsLister mobile.BuildConfigLister
}

func NewMobileBuildConfigsHandler(buildConfigsLister mobile.BuildConfigLister, namespace string) *MobileBuildConfigsHandler {
	return &MobileBuildConfigsHandler{
		buildConfigsLister: buildConfigsLister,
		namespace:          namespace,
	}
}

func (mbch *MobileBuildConfigsHandler) List(c echo.Context) error {
	buildConfigs, err := mbch.buildConfigsLister.List(mbch.namespace)
	if err != nil {
		c.Logger().Errorf("error listing build configs %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, buildConfigs)
}
