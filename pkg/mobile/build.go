package mobile

import (
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BuildCRUDLImpl struct {
	buildClient buildv1.BuildV1Interface
}

func NewBuildCRUDL(client buildv1.BuildV1Interface) *BuildCRUDLImpl {
	return &BuildCRUDLImpl{
		buildClient: client,
	}
}

func (crudl *BuildCRUDLImpl) List(namespace string) (*BuildList, error) {
	listOpts := metav1.ListOptions{}
	return crudl.buildClient.Builds(namespace).List(listOpts)
}
