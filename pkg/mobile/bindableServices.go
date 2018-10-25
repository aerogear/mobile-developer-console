package mobile

import (
	"encoding/json"
	"strings"

	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	k8v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BindableMobileServiceListerImpl struct {
	scClient         scv1beta1.ServicecatalogV1beta1Interface
	mobileClientRepo MobileClientRepo
	secretsCRUDL     SecretsCRUDL
}

func NewServiceBindingLister(scClient scv1beta1.ServicecatalogV1beta1Interface, mobileClientRepo MobileClientRepo, secretsCRUDL SecretsCRUDL) *BindableMobileServiceListerImpl {
	return &BindableMobileServiceListerImpl{
		scClient:         scClient,
		mobileClientRepo: mobileClientRepo,
		secretsCRUDL:     secretsCRUDL,
	}
}

func (lister *BindableMobileServiceListerImpl) Create(namespace string, binding *ServiceBinding, formData map[string]interface{}) (*ServiceBinding, error) {

	bindingsApi := lister.scClient.ServiceBindings(namespace)
	binding2, err := bindingsApi.Create(binding)
	if err != nil {
		return nil, err
	}

	// secret := &k8v1.Secret{
	// 	TypeMeta: metav1.TypeMeta{
	// 		Kind:       "Secret",
	// 		APIVersion: "v1",
	// 	},
	// 	ObjectMeta: metav1.ObjectMeta{
	// 		Name: binding2.Spec.SecretName,
	// 		OwnerReferences: []metav1.OwnerReference{{
	// 			APIVersion:         binding.TypeMeta.APIVersion,
	// 			Kind:               binding.TypeMeta.Kind,
	// 			Name:               binding2.ObjectMeta.Name,
	// 			UID:                binding2.ObjectMeta.UID,
	// 			Controller:         &[]bool{false}[0],
	// 			BlockOwnerDeletion: &[]bool{false}[0],
	// 		},
	// 		},
	// 	},
	// 	Type:       "Opaque",
	// 	StringData: formData,
	// }

	// _, err = lister.secretsCRUDL.Create(namespace, secret)

	// if err != nil {
	// 	return nil, err
	// }

	parametersSecret := makeParametersSecret(binding, binding2, formData)
	_, err = lister.secretsCRUDL.Create(namespace, parametersSecret)

	if err != nil {
		return nil, err
	}
	return binding2, nil

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

		if contains(csc.Spec.Tags, "mobile-client-enabled") {
			serviceBindingList.Items = append(serviceBindingList.Items, bindableService)
		}
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

	/*

			 var secret = {
		        apiVersion: 'v1',
		        kind: 'Secret',
		        metadata: {
		          name: secretName,
		          ownerReferences: [{
		            apiVersion: owner.apiVersion,
		            kind: owner.kind,
		            name: owner.metadata.name,
		            uid: owner.metadata.uid,
		            controller: false,
		            // TODO: Change to true when garbage collection works with service
		            // catalog resources. Setting to true now results in a 403 Forbidden
		            // error creating the secret.
		            blockOwnerDeletion: false
		          }]
		        },
		        type: 'Opaque',
		        stringData: {}
		      };

		      secret.stringData[PARAMETERS_SECRET_KEY] = JSON.stringify(parameters);
	*/
}
