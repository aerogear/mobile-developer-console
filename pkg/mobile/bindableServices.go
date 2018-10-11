package mobile

import (
	"encoding/json"
	"strings"

	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BindableMobileServiceListerImpl struct {
	scClient         scv1beta1.ServicecatalogV1beta1Interface
	mobileClientRepo MobileClientRepo
}

func NewServiceBindingLister(scClient scv1beta1.ServicecatalogV1beta1Interface, mobileClientRepo MobileClientRepo) *BindableMobileServiceListerImpl {
	return &BindableMobileServiceListerImpl{
		scClient:         scClient,
		mobileClientRepo: mobileClientRepo,
	}
}

func (lister *BindableMobileServiceListerImpl) List(namespace string) (*BindableMobileServiceList, error) {
	listOpts := v1.ListOptions{}
	getOpts := v1.GetOptions{}

	serviceBindingList := BindableMobileServiceList{}

	serviceBindings, err := lister.scClient.ServiceBindings(namespace).List(listOpts)

	if err != nil {
		return nil, err
	}

	serviceInstances, err := lister.scClient.ServiceInstances(namespace).List(listOpts)

	if err != nil {
		return nil, err
	}

	serviceInstances.Items = Filter(serviceInstances.Items, func(instance ServiceInstance) bool {
		return true
	})

	for _, serviceInstance := range serviceInstances.Items {

		bindableService := BindableMobileService{}

		csc, err := lister.scClient.ClusterServiceClasses().Get(serviceInstance.Spec.ClusterServiceClassRef.Name, getOpts)

		if err != nil {
			return nil, err
		}

		if csc.Spec.ExternalMetadata != nil {

			var x interface{}

			json.Unmarshal(csc.Spec.ExternalMetadata.Raw, &x)
			m := x.(map[string]interface{})

			bindableService.Name = m["displayName"].(string)

			if m["imageUrl"] != nil {
				bindableService.ImageURL = m["imageUrl"].(string)
			} else {
				if m["console.openshift.io/iconClass"] != nil {
					bindableService.IconClass = m["console.openshift.io/iconClass"].(string)
				} else {
					bindableService.ImageURL = "https://avatars1.githubusercontent.com/u/3380462?s=200&v=4"
				}
			}

		}

		servicePlans, err := lister.scClient.ClusterServicePlans().List(listOpts)

		if err != nil {
			return nil, err
		}
		var servicePlan ServicePlan

		for _, sb := range servicePlans.Items {
			if sb.Spec.ClusterServiceClassRef.Name == csc.Name {
				servicePlan = sb
			}
		}

		var serviceBinding ServiceBinding

		for _, sb := range serviceBindings.Items {
			if sb.Spec.ServiceInstanceRef.Name == serviceInstance.ObjectMeta.Name {
				serviceBinding = sb
				bindableService.IsBound = true
				var mobileClientName = sb.ObjectMeta.Annotations["binding.aerogear.org/consumer"]
				client, err := lister.mobileClientRepo.ReadByName(mobileClientName)

				if err != nil {
					return nil, err
				}

				bindableService.MobileClient = *client

				serviceConfigurationAnnotations := client.ObjectMeta.Annotations
				for key, jsonString := range serviceConfigurationAnnotations {
					if strings.Contains(key, "org.aerogear.binding."+serviceInstance.ObjectMeta.Name) {
						bindableService.Configuration = append(bindableService.Configuration, jsonString)
					}
				}
			}
		}

		bindableService.ServiceBinding = serviceBinding
		bindableService.ServiceClass = *csc
		bindableService.ServiceInstance = serviceInstance
		bindableService.ServicePlan = servicePlan

		serviceBindingList.Items = append(serviceBindingList.Items, bindableService)
	}

	return &serviceBindingList, nil
}

//Filter Helper for service instances
func Filter(vs []ServiceInstance, f func(ServiceInstance) bool) []ServiceInstance {
	vsf := make([]ServiceInstance, 0)
	for _, v := range vs {
		if f(v) {
			vsf = append(vsf, v)
		}
	}
	return vsf
}
