package mobile

import (
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BuildListerImpl struct {
	buildClient *buildv1.BuildV1Client
}

func NewBuildLister(client *buildv1.BuildV1Client) *BuildListerImpl {
	return &BuildListerImpl{
		buildClient: client,
	}
}

func (lister *BuildListerImpl) List(namespace string) (*BuildList, error) {
	listOpts := metav1.ListOptions{}
	return lister.buildClient.Builds(namespace).List(listOpts)
}
