package web

import (
	"fmt"
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
	buildV1 "github.com/openshift/api/build/v1"
)

type MobileBuildsHandler struct {
	buildsCRUDL        mobile.BuildCRUDL
	namespace          string
	openshiftMasterURL string
}

type extendedBuildList struct {
	buildV1.BuildList
	Items []extendedBuild `json:"items" protobuf:"bytes,2,rep,name=items"`
}

type extendedBuild struct {
	buildV1.Build
	BuildURL string `json:"buildUrl,inline"`
}

func NewMobileBuildsHandler(buildsCRUDL mobile.BuildCRUDL, namespace string, openshiftMasterURL string) *MobileBuildsHandler {
	return &MobileBuildsHandler{
		buildsCRUDL:        buildsCRUDL,
		namespace:          namespace,
		openshiftMasterURL: openshiftMasterURL,
	}
}

// Extend existing struct buildV1.BuildList so each build contains URL
// pointing to build in OpenShift Console
func extendBuildList(bl buildV1.BuildList, mbh MobileBuildsHandler) *extendedBuildList {
	extendedBuilds := make([]extendedBuild, len(bl.Items))

	for i, build := range bl.Items {
		buildConfigName := build.Status.Config.Name
		buildName := build.ObjectMeta.Name
		buildURL := fmt.Sprintf(
			"%s/console/project/%s/browse/pipelines/%s/%s",
			mbh.openshiftMasterURL, mbh.namespace, buildConfigName, buildName,
		)
		extendedBuilds[i] = extendedBuild{
			Build:    build,
			BuildURL: buildURL,
		}
	}
	return &extendedBuildList{
		BuildList: bl,
		Items:     extendedBuilds,
	}
}

func (mbh *MobileBuildsHandler) List(c echo.Context) error {
	builds, err := mbh.buildsCRUDL.List(mbh.namespace)
	if err != nil {
		c.Logger().Errorf("error listing builds %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, extendBuildList(*builds, *mbh))
}
