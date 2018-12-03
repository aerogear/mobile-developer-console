package mobile

import (
	"encoding/json"
	"fmt"
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"strings"

	"github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	k8v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

const (
	MOBILE_CLIENT_ID_LABEL_NAME = "mobileclients.mobile.k8s.io/clientId"
)

type BindableMobileServiceCRUDLImpl struct {
	scClient     scv1beta1.ServicecatalogV1beta1Interface
	secretsCRUDL SecretsCRUDL
}

func getLabelKeyForMobileClient(mobileClient *v1alpha1.MobileClient) map[string]string {
	return map[string]string{MOBILE_CLIENT_ID_LABEL_NAME: mobileClient.GetName()}
}

func (bms *BindableMobileServiceCRUDLImpl) NewBindingObject(data ServiceBindingCreateRequest, mobileClient *v1alpha1.MobileClient) *v1beta1.ServiceBinding {
	keyRef := v1beta1.SecretKeyReference{
		Key:  "parameters",
		Name: data.BindingParametersKey,
	}

	annotations := map[string]string{
		"binding.aerogear.org/consumer": mobileClient.GetName(),
		"binding.aerogear.org/provider": data.ServiceInstanceName,
	}

	//adding extra annotations for platforms. This should be only set by push for now
	clientType := data.FormData["CLIENT_TYPE"]
	if clientType != nil && (strings.EqualFold(clientType.(string), "ios") || strings.EqualFold(clientType.(string), "android")) {
		annotations["mobile.aerogear.org/platform"] = strings.ToLower(clientType.(string))
	}

	return &v1beta1.ServiceBinding{
		TypeMeta: metav1.TypeMeta{
			Kind:       "ServiceBinding",
			APIVersion: "servicecatalog.k8s.io/v1beta1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Namespace:    mobileClient.GetNamespace(),
			GenerateName: mobileClient.GetName() + "-" + data.ServiceClassExternalName + "-",
			Annotations:  annotations,
			Labels:       getLabelKeyForMobileClient(mobileClient),
		},
		Spec: v1beta1.ServiceBindingSpec{
			ServiceInstanceRef: v1beta1.LocalObjectReference{
				Name: data.ServiceInstanceName,
			},
			SecretName: data.BindingSecretKey,
			ParametersFrom: []v1beta1.ParametersFromSource{{
				SecretKeyRef: &keyRef,
			},
			},
		},
	}
}

func NewServiceBindingLister(scClient scv1beta1.ServicecatalogV1beta1Interface, secretsCRUDL SecretsCRUDL) *BindableMobileServiceCRUDLImpl {
	return &BindableMobileServiceCRUDLImpl{
		scClient:     scClient,
		secretsCRUDL: secretsCRUDL,
	}
}

func (lister *BindableMobileServiceCRUDLImpl) Create(binding *ServiceBinding, formData map[string]interface{}) (*ServiceBinding, error) {

	bindingsApi := lister.scClient.ServiceBindings(binding.GetNamespace())
	binding2, err := bindingsApi.Create(binding)
	if err != nil {
		return nil, err
	}

	parametersSecret := makeParametersSecret(binding, binding2, formData)
	_, err = lister.secretsCRUDL.Create(binding.GetNamespace(), parametersSecret)

	if err != nil {
		return nil, err
	}
	return binding2, nil

}

func (lister *BindableMobileServiceCRUDLImpl) Delete(namespace string, bindingName string) error {
	return lister.scClient.ServiceBindings(namespace).Delete(bindingName, &v1.DeleteOptions{})
}

func (lister *BindableMobileServiceCRUDLImpl) Watch(mobileClient *v1alpha1.MobileClient) func() (watch.Interface, error) {
	return func() (watch.Interface, error) {
		watchOpts := metav1.ListOptions{}
		return lister.scClient.ServiceBindings(mobileClient.GetNamespace()).Watch(watchOpts)
	}
}

func (bms *BindableMobileServiceCRUDLImpl) DeleteAppData(mobileClient *v1alpha1.MobileClient) error {
	bindListOpts := v1.ListOptions{
		LabelSelector: fmt.Sprintf("%s=%s", MOBILE_CLIENT_ID_LABEL_NAME, mobileClient.GetName()),
	}

	bindings, err := bms.scClient.ServiceBindings(mobileClient.GetNamespace()).List(bindListOpts)

	if err != nil {
		return err
	}

	for _, binding := range bindings.Items {
		err := bms.Delete(mobileClient.GetNamespace(), binding.GetName())
		if err != nil {
			return err
		}
	}
	return nil
}

func (lister *BindableMobileServiceCRUDLImpl) List(mobileClient *v1alpha1.MobileClient) (*BindableMobileServiceList, error) {
	namespace := mobileClient.GetNamespace()
	listOpts := v1.ListOptions{}

	getOpts := v1.GetOptions{}

	serviceBindingList := BindableMobileServiceList{}

	serviceInstances, err := lister.scClient.ServiceInstances(namespace).List(listOpts)

	if err != nil {
		return nil, err
	}

	servicePlans, err := lister.scClient.ClusterServicePlans().List(listOpts)

	if err != nil {
		return nil, err
	}

	for _, serviceInstance := range serviceInstances.Items {

		csc, err := lister.scClient.ClusterServiceClasses().Get(serviceInstance.Spec.ClusterServiceClassRef.Name, getOpts)

		if err != nil {
			return nil, err
		}

		if contains(csc.Spec.Tags, "mobile-client-enabled") {
			bindableService := BindableMobileService{}

			bindableService.ServiceInstance = serviceInstance
			bindableService.ServiceClass = *csc

			attachServiceIcon(&bindableService, csc)
			attachServicePlan(&bindableService, servicePlans, csc)
			err = attachCurrentBindings(lister, mobileClient, &bindableService, serviceInstance)

			if err != nil {
				return nil, err
			}

			serviceBindingList.Items = append(serviceBindingList.Items, bindableService)
		}
	}

	return &serviceBindingList, nil
}

func attachCurrentBindings(lister *BindableMobileServiceCRUDLImpl, mobileClient *v1alpha1.MobileClient, bindableService *BindableMobileService, serviceInstance ServiceInstance) error {
	listOpts := v1.ListOptions{}

	serviceBindings, err := lister.scClient.ServiceBindings(mobileClient.GetNamespace()).List(listOpts)

	if err != nil {
		return err
	}
	for _, sb := range serviceBindings.Items {
		if sb.Spec.ServiceInstanceRef.Name == serviceInstance.ObjectMeta.Name &&
			sb.ObjectMeta.Annotations["binding.aerogear.org/consumer"] == mobileClient.GetName() {
			if serviceBindingIsReady(sb) {
				bindableService.IsBound = true
			}

			bindableService.MobileClient = *mobileClient

			serviceConfigurationAnnotations := mobileClient.ObjectMeta.Annotations
			for key, jsonString := range serviceConfigurationAnnotations {
				if strings.Contains(key, "org.aerogear.binding."+serviceInstance.ObjectMeta.Name) {
					bindableService.Configuration = append(bindableService.Configuration, jsonString)
				} else if strings.Contains(key, "org.aerogear.binding-ext."+serviceInstance.ObjectMeta.Name) {
					// aerogear extended annotations
					bindableService.ConfigurationExt = append(bindableService.ConfigurationExt, jsonString)
				}
			}
		}
	}

	// remove duplicates in the config.
	// in case of services that can have multiple bindings, we don't want to have duplicate elements.
	bindableService.Configuration = removeDuplicatesUnordered(bindableService.Configuration)
	bindableService.ConfigurationExt = removeDuplicatesUnordered(bindableService.ConfigurationExt)
	bindableService.ServiceBindings = serviceBindings.Items
	return nil
}

func removeDuplicatesUnordered(elements []string) []string {
	encountered := map[string]bool{}

	// Create a map of all unique elements.
	for v := range elements {
		encountered[elements[v]] = true
	}

	// Place all keys from the map into a slice.
	result := []string{}
	for key, _ := range encountered {
		result = append(result, key)
	}
	return result
}

func attachServicePlan(bindableService *BindableMobileService, servicePlans *v1beta1.ClusterServicePlanList, csc *v1beta1.ClusterServiceClass) {
	var servicePlan ServicePlan

	for _, sb := range servicePlans.Items {
		if sb.Spec.ClusterServiceClassRef.Name == csc.Name {
			servicePlan = sb
		}
	}

	bindableService.ServicePlan = servicePlan
}

func attachServiceIcon(bindableService *BindableMobileService, csc *v1beta1.ClusterServiceClass) {
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

func makeParametersSecret(binding *ServiceBinding, binding2 *ServiceBinding, formData map[string]interface{}) *k8v1.Secret {
	parametersSecretName := binding.Spec.ParametersFrom[0].SecretKeyRef.Name
	jsonStringData, _ := json.Marshal(formData)
	return &k8v1.Secret{
		TypeMeta: metav1.TypeMeta{
			Kind:       "Secret",
			APIVersion: "servicecatalog.k8s.io/v1beta1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name: parametersSecretName,
			OwnerReferences: []metav1.OwnerReference{
				{
					APIVersion: binding.APIVersion,
					Kind:       binding.Kind,
					Name:       binding2.ObjectMeta.Name,
					UID:        binding2.ObjectMeta.UID,
					Controller: &[]bool{false}[0],
					// TODO: Change to true when garbage collection works with service
					// catalog resources. Setting to true now results in a 403 Forbidden
					// error creating the secret.
					BlockOwnerDeletion: &[]bool{false}[0],
				},
			},
		},
		Type:       "Opaque",
		StringData: map[string]string{"parameters": string(jsonStringData)},
	}
}

func serviceBindingIsReady(binding ServiceBinding) bool {
	ready := false
	for _, condition := range binding.Status.Conditions {
		if condition.Type == v1beta1.ServiceBindingConditionReady && condition.Status == v1beta1.ConditionTrue {
			ready = true
			break
		}
	}
	return ready
}
