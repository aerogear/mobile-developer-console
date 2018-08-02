package mobile

import "k8s.io/apimachinery/pkg/runtime"

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
