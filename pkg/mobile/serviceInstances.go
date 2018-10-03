package mobile

import (
	v1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

type ServiceInstanceListerImpl struct {
	scClient  scv1beta1.ServicecatalogV1beta1Interface
	namespace string
}

func NewServiceInstanceLister(scClient scv1beta1.ServicecatalogV1beta1Interface, namespace string) *ServiceInstanceListerImpl {
	return &ServiceInstanceListerImpl{
		scClient:  scClient,
		namespace: namespace,
	}
}

func (lister *ServiceInstanceListerImpl) List() (*ServiceInstanceList, error) {
	listOpts := v1.ListOptions{}
	getOpts := v1.GetOptions{}
	serviceInstanceList := ServiceInstanceList{}

	serviceInstances, err := lister.scClient.ServiceInstances(lister.namespace).List(listOpts)
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

func (lister *ServiceInstanceListerImpl) Watch() (watch.Interface, error) {
	watchOpts := metav1.ListOptions{}
	return lister.scClient.ServiceInstances(lister.namespace).Watch(watchOpts)
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
