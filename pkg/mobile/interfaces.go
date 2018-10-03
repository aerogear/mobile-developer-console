package mobile

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	k8v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/watch"
)

//ServiceInstanceLister can list service instances from a name space
type ServiceInstanceLister interface {
	List() (*ServiceInstanceList, error)
	Watch() (watch.Interface, error)
}

type BuildCRUDL interface {
	List() (*ExtendedBuildList, error)
	Watch() (watch.Interface, error)
}

type BuildConfigCRUDL interface {
	Create(config *BuildConfig) (*BuildConfig, error)
	DeleteByName(name string) error
	List() (*BuildConfigList, error)
	Instantiate(name string) (*Build, error)
	Watch() (watch.Interface, error)
}

type MobileClientRepo interface {
	Create(app *v1alpha1.MobileClient) error
	ReadByName(name string) (*v1alpha1.MobileClient, error)
	Update(app *v1alpha1.MobileClient) error
	List() (*v1alpha1.MobileClientList, error)
	DeleteByName(name string) error
	Watch() (watch.Interface, error)
}

type SecretsCRUDL interface {
	Create(namespace string, secret *k8v1.Secret) (*k8v1.Secret, error)
}
