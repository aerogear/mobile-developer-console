package mobile

import (
	v1 "github.com/openshift/api/build/v1"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	"github.com/operator-framework/operator-sdk/pkg/util/k8sutil"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BuildConfigCRUDLImpl struct {
	buildClient buildv1.BuildV1Interface
}

func NewBuildConfigCRUDL(client buildv1.BuildV1Interface) *BuildConfigCRUDLImpl {
	return &BuildConfigCRUDLImpl{
		buildClient: client,
	}
}

func (crudl *BuildConfigCRUDLImpl) Create(config *BuildConfig) (*BuildConfig, error) {
	_, namespace, err := k8sutil.GetNameAndNamespace(config)
	if err != nil {
		return nil, err
	}
	return crudl.buildClient.BuildConfigs(namespace).Create(config)
}

func (crudl *BuildConfigCRUDLImpl) DeleteByName(namespace string, name string) error {
	deleteOpts := &metav1.DeleteOptions{}
	return crudl.buildClient.BuildConfigs(namespace).Delete(name, deleteOpts)
}

func (crudl *BuildConfigCRUDLImpl) List(namespace string) (*BuildConfigList, error) {
	listOpts := metav1.ListOptions{}
	return crudl.buildClient.BuildConfigs(namespace).List(listOpts)
}

func (crudl *BuildConfigCRUDLImpl) Instantiate(namespace string, name string) (*Build, error) {
	request := &v1.BuildRequest{
		TypeMeta: metav1.TypeMeta{
			Kind:       "BuildRequest",
			APIVersion: "build.openshift.io/v1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
	}
	return crudl.buildClient.BuildConfigs(namespace).Instantiate(name, request)
}
