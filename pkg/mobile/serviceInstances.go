package mobile

import (
	sc "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type ServiceInstanceListerImpl struct {
	scClient *sc.Clientset
}

func NewServiceInstanceLister(scClient *sc.Clientset) *ServiceInstanceListerImpl {
	return &ServiceInstanceListerImpl{
		scClient: scClient,
	}
}

func (lister *ServiceInstanceListerImpl) List(namespace string) (*ServiceInstanceList, error) {
	listOpts := v1.ListOptions{}
	return lister.scClient.ServicecatalogV1beta1().ServiceInstances(namespace).List(listOpts)
}
