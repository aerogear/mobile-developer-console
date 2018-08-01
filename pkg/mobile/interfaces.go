package mobile


import (
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	"k8s.io/apimachinery/pkg/runtime")


//ServiceInstanceLister can list service instances from a name space
type ServiceInstanceLister interface {
	List(namespace string) (*ServiceInstanceList, error)
}

type BuildLister interface {
	List(namespace string) (*BuildList, error)
}

type BuildConfigLister interface {
	List(namespace string) (*BuildConfigList, error)
}


type MobileResourceLister interface {
	List() (runtime.Object, error)
}

type MobileClientCrudler interface {
	Create(client v1alpha1.MobileClient) *v1alpha1.MobileClient
	Read(name string) *v1alpha1.MobileClient
	Update(name string, client v1alpha1.MobileClient) *v1alpha1.MobileClient
	List(namespace string) *v1alpha1.MobileClientList
	Delete(name string) *v1alpha1.MobileClient
}

type MobileClientRepo interface {
	Create(app *v1alpha1.MobileClient) error
	ReadByName(name string) (*v1alpha1.MobileClient, error)
	Update(app v1alpha1.MobileClient) (*v1alpha1.MobileClient, error)
	List(namespace string) (*v1alpha1.MobileClientList, error)
	DeleteByName(name string) error
}
