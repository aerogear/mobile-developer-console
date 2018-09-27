package mobile

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	k8v1 "k8s.io/api/core/v1"
)

//ServiceInstanceLister can list service instances from a name space
type ServiceInstanceLister interface {
	List(namespace string) (*ServiceInstanceList, error)
}

type BuildCRUDL interface {
	List(namespace string) (*BuildList, error)
}

type BuildConfigCRUDL interface {
	Create(config *BuildConfig) (*BuildConfig, error)
	DeleteByName(namespace string, name string) error
	List(namespace string) (*BuildConfigList, error)
	Instantiate(namespace string, name string) (*Build, error)
}

type MobileClientRepo interface {
	Create(app *v1alpha1.MobileClient) error
	ReadByName(name string) (*v1alpha1.MobileClient, error)
	Update(app *v1alpha1.MobileClient) error
	List(namespace string) (*v1alpha1.MobileClientList, error)
	DeleteByName(name string) error
}

type SecretsCRUDL interface {
	Create(namespace string, secret *k8v1.Secret) (*k8v1.Secret, error)
}
