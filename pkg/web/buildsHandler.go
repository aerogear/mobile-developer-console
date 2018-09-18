package web

import (
	"net/http"

	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileBuildsHandler struct {
	namespace   string
	buildsCRUDL mobile.BuildCRUDL
}

func NewMobileBuildsHandler(buildsCRUDL mobile.BuildCRUDL, namespace string) *MobileBuildsHandler {
	return &MobileBuildsHandler{
		buildsCRUDL: buildsCRUDL,
		namespace:   namespace,
	}
}

func (mbh *MobileBuildsHandler) List(c echo.Context) error {
	builds, err := mbh.buildsCRUDL.List(mbh.namespace)
	if err != nil {
		c.Logger().Errorf("error listing builds %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}

	return c.JSON(http.StatusOK, builds)
}
