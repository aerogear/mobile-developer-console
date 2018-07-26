package mobile

import (
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BuildConfigListerImpl struct {
	buildClient *buildv1.BuildV1Client
}

func NewBuildConfigLister(client *buildv1.BuildV1Client) *BuildConfigListerImpl {
	return &BuildConfigListerImpl{
		buildClient: client,
	}
}

func (lister *BuildConfigListerImpl) List(namespace string) (*BuildConfigList, error) {
	listOpts := metav1.ListOptions{}
	return lister.buildClient.BuildConfigs(namespace).List(listOpts)
}
