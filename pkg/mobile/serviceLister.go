package mobile

import (
	core_v1 "k8s.io/api/core/v1"
	meta_v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

//ServiceLister is an interface that can list mobile-enabled services
type ServiceLister interface {
	List(namespace string) ([]*Service, error)
}

func NewServiceLister(k8sClient *kubernetes.Clientset) *ServiceListerImpl {
	return &ServiceListerImpl{
		k8sClient: k8sClient,
	}
}

type ServiceListerImpl struct {
	k8sClient *kubernetes.Clientset
}

func (sl *ServiceListerImpl) List(namespace string) ([]*Service, error) {
	listOpts := meta_v1.ListOptions{}
	k8sServicesList, err := sl.k8sClient.CoreV1().Services(namespace).List(listOpts)
	if err != nil {
		return nil, err
	}
	services := make([]*Service, 0)
	for _, k8sService := range k8sServicesList.Items {
		services = append(services, convertToMobileService(k8sService))
	}
	return services, nil
}

func convertToMobileService(k8sService core_v1.Service) *Service {
	return &Service{
		ID:     k8sService.Name,
		Name:   k8sService.Name,
		Labels: k8sService.Labels,
	}
}
