package mobile

import (
	v1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
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
	getOpts := v1.GetOptions{}
	serviceInstanceList := ServiceInstanceList{}

	serviceInstances, err := lister.scClient.ServiceInstances(namespace).List(listOpts)
	if err != nil {
		return nil, err
	}

	for _, si := range serviceInstances.Items {
		sc, err := lister.scClient.ClusterServiceClasses().Get(si.Spec.ClusterServiceClassRef.Name, getOpts)
		if err != nil {
			return nil, err
		}

		if isMobileService(sc) {
			addAnnotation(&si, "aerogear.org/mobile-service", "true")
			if isMobileClientEnabled(sc) {
				addAnnotation(&si, "aerogear.org/mobile-client-enabled", "true")
			}
			serviceInstanceList.Items = append(serviceInstanceList.Items, si)
		}
	}

	return &serviceInstanceList, nil
}

func isMobileService(sc *v1beta1.ClusterServiceClass) bool {
	return contains(sc.Spec.Tags, "mobile-service")
}

func isMobileClientEnabled(sc *v1beta1.ClusterServiceClass) bool {
	return contains(sc.Spec.Tags, "mobile-client-enabled")
}

func addAnnotation(si *v1beta1.ServiceInstance, name string, value string) {
	if si.Annotations == nil {
		si.Annotations = make(map[string]string)
	}
	si.Annotations[name] = value
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}
