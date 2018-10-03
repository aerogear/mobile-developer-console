package web

import (
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileBuildsHandler struct {
	buildsCRUDL        mobile.BuildCRUDL
	namespace          string
	openshiftMasterURL string
}

type response struct {
	mobile.BuildList
	OpenshiftMasterURL string `json:"openshiftMasterUrl,inline"`
}

func NewMobileBuildsHandler(buildsCRUDL mobile.BuildCRUDL, namespace string, openshiftMasterURL string) *MobileBuildsHandler {
	return &MobileBuildsHandler{
		buildsCRUDL:        buildsCRUDL,
		namespace:          namespace,
		openshiftMasterURL: openshiftMasterURL,
	}
}

func (mbh *MobileBuildsHandler) List(c echo.Context) error {
	builds, err := mbh.buildsCRUDL.List(mbh.namespace)
	if err != nil {
		c.Logger().Errorf("error listing builds %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	response := &response{
		BuildList:          *builds,
		OpenshiftMasterURL: mbh.openshiftMasterURL,
	}
	return c.JSON(http.StatusOK, response)
}
