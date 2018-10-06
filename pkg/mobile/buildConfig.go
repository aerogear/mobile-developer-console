package mobile

import (
	v1 "github.com/openshift/api/build/v1"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

type BuildConfigCRUDLImpl struct {
	buildClient buildv1.BuildV1Interface
	namespace   string
}

func NewBuildConfigCRUDL(client buildv1.BuildV1Interface, namespace string) *BuildConfigCRUDLImpl {
	return &BuildConfigCRUDLImpl{
		buildClient: client,
		namespace:   namespace,
	}
}

func (crudl *BuildConfigCRUDLImpl) Create(config *BuildConfig) (*BuildConfig, error) {
	return crudl.buildClient.BuildConfigs(crudl.namespace).Create(config)
}

func (crudl *BuildConfigCRUDLImpl) DeleteByName(name string) error {
	deleteOpts := &metav1.DeleteOptions{}
	return crudl.buildClient.BuildConfigs(crudl.namespace).Delete(name, deleteOpts)
}

func (crudl *BuildConfigCRUDLImpl) List() (*BuildConfigList, error) {
	listOpts := metav1.ListOptions{}
	return crudl.buildClient.BuildConfigs(crudl.namespace).List(listOpts)
}

func (crudl *BuildConfigCRUDLImpl) Instantiate(name string) (*Build, error) {
	request := &v1.BuildRequest{
		TypeMeta: metav1.TypeMeta{
			Kind:       "BuildRequest",
			APIVersion: "build.openshift.io/v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: crudl.namespace,
		},
	}
	return crudl.buildClient.BuildConfigs(crudl.namespace).Instantiate(name, request)
}

func (crudl *BuildConfigCRUDLImpl) Watch() func() (watch.Interface, error) {
	return func() (watch.Interface, error) {
		watchOpts := metav1.ListOptions{}
		return crudl.buildClient.BuildConfigs(crudl.namespace).Watch(watchOpts)
	}
}
