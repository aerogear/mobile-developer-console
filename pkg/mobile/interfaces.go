package mobile

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	k8v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/watch"
)

//ServiceInstanceLister can list service instances from a name space
type ServiceInstanceLister interface {
	List() (*ServiceInstanceList, error)
	Watch() func() (watch.Interface, error)
}

type BindableMobileServiceLister interface {
	List(namespace string) (*BindableMobileServiceList, error)
	Create(namespace string, binding *scv1beta1.ServiceBinding, formData map[string]string) (*scv1beta1.ServiceBinding, error)
}
type BuildCRUDL interface {
	List() (*ExtendedBuildList, error)
	Watch() func() (watch.Interface, error)
	GenerateDownloadURL(name string) error
}

type BuildConfigCRUDL interface {
	Create(config *BuildConfig) (*BuildConfig, error)
	DeleteByName(name string) error
	List() (*BuildConfigList, error)
	Instantiate(name string) (*Build, error)
	Watch() func() (watch.Interface, error)
}

type MobileClientRepo interface {
	Create(app *v1alpha1.MobileClient) error
	ReadByName(name string) (*v1alpha1.MobileClient, error)
	Update(app *v1alpha1.MobileClient) error
	List() (*v1alpha1.MobileClientList, error)
	DeleteByName(name string) error
	Watch() func() (watch.Interface, error)
}

type SecretsCRUDL interface {
	Create(namespace string, secret *k8v1.Secret) (*k8v1.Secret, error)
}
