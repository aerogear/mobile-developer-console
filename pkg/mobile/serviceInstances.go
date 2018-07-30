package mobile

import (
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type ServiceInstanceListerImpl struct {
	scClient scv1beta1.ServicecatalogV1beta1Interface
}

func NewServiceInstanceLister(scClient scv1beta1.ServicecatalogV1beta1Interface) *ServiceInstanceListerImpl {
	return &ServiceInstanceListerImpl{
		scClient: scClient,
	}
}

func (lister *ServiceInstanceListerImpl) List(namespace string) (*ServiceInstanceList, error) {
	listOpts := v1.ListOptions{}
	return lister.scClient.ServiceInstances(namespace).List(listOpts)
}
