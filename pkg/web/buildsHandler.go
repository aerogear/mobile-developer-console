package web

import (
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileBuildsHandler struct {
	buildsCRUDL mobile.BuildCRUDL
	namespace   string
}

func NewMobileBuildsHandler(buildsCRUDL mobile.BuildCRUDL, namespace string) *MobileBuildsHandler {
	return &MobileBuildsHandler{
		buildsCRUDL: buildsCRUDL,
		namespace:   namespace,
	}
}

func (mbh *MobileBuildsHandler) List(c echo.Context) error {
	builds, err := mbh.buildsCRUDL.List()
	if err != nil {
		c.Logger().Errorf("error listing builds: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.JSON(http.StatusOK, builds)
}

func (mbh *MobileBuildsHandler) Watch(c echo.Context) error {
	getWatchInterface := mbh.buildsCRUDL.Watch()

	err := ServeWS(c, getWatchInterface)
	if err != nil {
		c.Logger().Errorf("error watching builds: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return nil
}

func (mbh *MobileBuildsHandler) GenerateDownloadURL(c echo.Context) error {
	name := c.Param("name")
	err := mbh.buildsCRUDL.GenerateDownloadURL(name)
	if err != nil {
		c.Logger().Errorf("error generating download url %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.NoContent(http.StatusOK)
}
