package mobile

import (
	"fmt"

	buildV1 "github.com/openshift/api/build/v1"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

type BuildCRUDLImpl struct {
	buildClient        buildv1.BuildV1Interface
	namespace          string
	openshiftMasterURL string
}

type ExtendedBuildList struct {
	buildV1.BuildList
	Items []ExtendedBuild `json:"items" protobuf:"bytes,2,rep,name=items"`
}

type ExtendedBuild struct {
	buildV1.Build
	BuildURL string `json:"buildUrl,inline"`
}

func NewBuildCRUDL(client buildv1.BuildV1Interface, namespace string, openshiftMasterURL string) *BuildCRUDLImpl {
	return &BuildCRUDLImpl{
		buildClient:        client,
		namespace:          namespace,
		openshiftMasterURL: openshiftMasterURL,
	}
}

// Extend existing struct buildV1.BuildList so each build contains URL
// pointing to build in OpenShift Console
func extendBuildList(bl *buildV1.BuildList, openshiftMasterURL string, namespace string) *ExtendedBuildList {
	extendedBuilds := make([]ExtendedBuild, len(bl.Items))

	for i, build := range bl.Items {
		buildConfigName := build.Status.Config.Name
		buildName := build.ObjectMeta.Name
		buildURL := fmt.Sprintf(
			"%s/console/project/%s/browse/pipelines/%s/%s",
			openshiftMasterURL, namespace, buildConfigName, buildName,
		)
		extendedBuilds[i] = ExtendedBuild{
			Build:    build,
			BuildURL: buildURL,
		}
	}
	return &ExtendedBuildList{
		BuildList: *bl,
		Items:     extendedBuilds,
	}
}

func (crudl *BuildCRUDLImpl) List() (*ExtendedBuildList, error) {
	listOpts := metav1.ListOptions{}
	buildList, err := crudl.buildClient.Builds(crudl.namespace).List(listOpts)
	if err != nil {
		return nil, err
	}
	return extendBuildList(buildList, crudl.openshiftMasterURL, crudl.namespace), nil
}

func (crudl *BuildCRUDLImpl) Watch() (watch.Interface, error) {
	watchOpts := metav1.ListOptions{}
	return crudl.buildClient.Builds(crudl.namespace).Watch(watchOpts)
}
