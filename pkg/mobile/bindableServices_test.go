package mobile

import (
	"testing"

	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	sctypes "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	fakesc "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/fake"
	"github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	fakecore "k8s.io/client-go/kubernetes/fake"
)

const (
	namespace = "test"
)

func getSCClient(objects ...runtime.Object) v1beta1.ServicecatalogV1beta1Interface {
	client := fakesc.NewSimpleClientset(objects...)
	return client.ServicecatalogV1beta1()
}

func getSecrectClient(objects ...runtime.Object) SecretsCRUDL {
	coreClient := fakecore.NewSimpleClientset(objects...)
	return NewSecretsCRUDL(coreClient.CoreV1())
}

func newTestMobileClient(name string) *v1alpha1.MobileClient {
	return &v1alpha1.MobileClient{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testapp",
			Namespace: namespace,
		},
	}
}

func TestCreate(t *testing.T) {
	cases := []struct {
		Name          string
		ExpectError   bool
		SCClient      v1beta1.ServicecatalogV1beta1Interface
		SecrectClient SecretsCRUDL
	}{
		{
			Name:          "Create a BindableService",
			ExpectError:   false,
			SCClient:      getSCClient(),
			SecrectClient: getSecrectClient(),
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			scClient := tc.SCClient
			secretClient := tc.SecrectClient
			c := NewServiceBindingLister(scClient, secretClient)
			binding := &ServiceBinding{
				ObjectMeta: v1.ObjectMeta{
					Namespace: namespace,
				},
				Spec: sctypes.ServiceBindingSpec{
					ParametersFrom: []sctypes.ParametersFromSource{
						{
							SecretKeyRef: &sctypes.SecretKeyReference{
								Name: "testKeyRef",
							},
						},
					},
				},
			}
			formData := map[string]interface{}{}
			sb, err := c.Create(binding, formData)
			if sb == nil {
				t.Fatalf("failed to create BindableService")
			}
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			bindings, _ := scClient.ServiceBindings(namespace).List(v1.ListOptions{})
			if len(bindings.Items) != 1 {
				t.Fatalf("service binding is not created")
			}
			secrets, _ := secretClient.List(namespace)
			if len(secrets.Items) != 1 {
				t.Fatalf(" secret is not created")
			}
		})
	}
}

func TestWatch(t *testing.T) {

	cases := []struct {
		Name          string
		ExpectError   bool
		SCClient      v1beta1.ServicecatalogV1beta1Interface
		SecrectClient SecretsCRUDL
	}{
		{
			Name:          "Watch bindings",
			ExpectError:   false,
			SCClient:      getSCClient(),
			SecrectClient: getSecrectClient(),
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {

			scClient := tc.SCClient
			secretClient := tc.SecrectClient
			crudl := NewServiceBindingLister(scClient, secretClient)

			mc := newTestMobileClient("testapp")

			result, err := crudl.Watch(mc)()
			if err != nil {
				t.Fatalf("error: %v", err)
			}
			if result == nil {
				t.Fatalf("no watch interface returned")
			}
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func TestDelete(t *testing.T) {
	b := &sctypes.ServiceBinding{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testbinding",
			Namespace: namespace,
		},
	}
	cases := []struct {
		Name        string
		ExpectError bool
		SCClient    v1beta1.ServicecatalogV1beta1Interface
	}{
		{
			Name:        "Delete a BindableService",
			ExpectError: false,
			SCClient:    getSCClient(b),
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			scClient := tc.SCClient
			c := NewServiceBindingLister(scClient, nil)
			bindings, _ := scClient.ServiceBindings(namespace).List(v1.ListOptions{})
			if len(bindings.Items) != 1 {
				t.Fatalf("service binding is not created")
			}
			err := c.Delete(namespace, "testbinding")
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			bindings, _ = scClient.ServiceBindings(namespace).List(v1.ListOptions{})
			if len(bindings.Items) != 0 {
				t.Fatalf("service binding is not deleted")
			}
		})
	}
}

func newClusterServiceClass(name string) *sctypes.ClusterServiceClass {
	return &sctypes.ClusterServiceClass{
		ObjectMeta: v1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: sctypes.ClusterServiceClassSpec{
			CommonServiceClassSpec: sctypes.CommonServiceClassSpec{
				Tags: []string{"mobile-client-enabled"},
			},
		},
	}
}

func newClusterServicePlan(planName string, classRefName string) *sctypes.ClusterServicePlan {
	return &sctypes.ClusterServicePlan{
		ObjectMeta: v1.ObjectMeta{
			Name:      planName,
			Namespace: namespace,
		},
		Spec: sctypes.ClusterServicePlanSpec{
			ClusterServiceClassRef: sctypes.ClusterObjectReference{
				Name: classRefName,
			},
		},
	}
}

func newServiceInstance(name string, classRefName string) *sctypes.ServiceInstance {
	return &sctypes.ServiceInstance{
		ObjectMeta: v1.ObjectMeta{
			Name:      name,
			Namespace: namespace,
		},
		Spec: sctypes.ServiceInstanceSpec{
			ClusterServiceClassRef: &sctypes.ClusterObjectReference{
				Name: classRefName,
			},
		},
	}
}

func newSerivceBinding(name string, instanceRef string, status sctypes.ConditionStatus) *sctypes.ServiceBinding {
	return &sctypes.ServiceBinding{
		ObjectMeta: v1.ObjectMeta{
			Name:        name,
			Namespace:   namespace,
			Annotations: map[string]string{"binding.aerogear.org/consumer": "testapp"},
		},
		Spec: sctypes.ServiceBindingSpec{
			ServiceInstanceRef: sctypes.LocalObjectReference{
				Name: instanceRef,
			},
		},
		Status: sctypes.ServiceBindingStatus{
			Conditions: []sctypes.ServiceBindingCondition{
				{
					Type:   sctypes.ServiceBindingConditionReady,
					Status: status,
				},
			},
		},
	}
}

func TestList(t *testing.T) {
	serviceClass1 := newClusterServiceClass("serviceclass1")
	servicePlan1 := newClusterServicePlan("serviceplan1", "serviceclass1")
	serviceInstance1 := newServiceInstance("serviceinstance1", "serviceclass1")
	serviceBinding1 := newSerivceBinding("serviceBinding1", "serviceinstance1", sctypes.ConditionTrue)

	serviceClass2 := newClusterServiceClass("serviceclass2")
	servicePlan2 := newClusterServicePlan("serviceplan2", "serviceclass2")
	serviceInstance2 := newServiceInstance("serviceinstance2", "serviceclass2")
	serviceBinding2 := newSerivceBinding("serviceBinding2", "serviceinstance2", sctypes.ConditionFalse)

	cases := []struct {
		Name        string
		ExpectError bool
		SCClient    v1beta1.ServicecatalogV1beta1Interface
	}{
		{
			Name:        "List BindableServices for an app",
			ExpectError: false,
			SCClient: getSCClient(
				serviceClass1,
				servicePlan1,
				serviceInstance1,
				serviceBinding1,
				serviceClass2,
				servicePlan2,
				serviceInstance2,
				serviceBinding2),
		},
	}
	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			scClient := tc.SCClient
			c := NewServiceBindingLister(scClient, nil)
			bindableServiceList, err := c.List(newTestMobileClient("testapp"))
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			if len(bindableServiceList.Items) != 2 {
				t.Fatalf("there should be 2 bindable services returned")
			}
		})
	}
}

func TestNewBindingObject(t *testing.T) {
	scClient := getSCClient()
	secretClient := getSecrectClient()
	crudl := NewServiceBindingLister(scClient, secretClient)

	mc := newTestMobileClient("testapp")
	data := ServiceBindingCreateRequest{
		BindingParametersKey:     "testBindingParameterKey",
		ServiceClassExternalName: "testServiceClientExternalName",
		ServiceInstanceName:      "testServiceInstanceName",
		FormData: map[string]interface{}{
			"CLIENT_TYPE": "ios",
		},
	}

	binding := crudl.NewBindingObject(data, mc)
	if binding == nil {
		t.Fatalf("binding object is not returned")
	}
	if binding.GetNamespace() == "" {
		t.Fatalf("namespace is not set")
	}
	if binding.GetGenerateName() == "" {
		t.Fatalf("generatename is not set")
	}
	if len(binding.GetAnnotations()) != 3 {
		t.Fatalf("annotation count is not 3")
	}
	if len(binding.Labels) != 1 {
		t.Fatalf("no labels set")
	}
}

func TestDeleteBindingsForApp(t *testing.T) {
	mc := newTestMobileClient("testapp")

	sb1 := &sctypes.ServiceBinding{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testbinding1",
			Namespace: namespace,
			Labels: map[string]string{
				MOBILE_CLIENT_ID_LABEL_NAME: "testapp",
			},
		},
	}

	sb2 := &sctypes.ServiceBinding{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testbinding2",
			Namespace: namespace,
		},
	}

	scClient := getSCClient(sb1, sb2)
	crudl := NewServiceBindingLister(scClient, nil)
	err := crudl.DeleteAppData(mc)

	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	list, err := scClient.ServiceBindings(namespace).List(v1.ListOptions{})
	if err != nil {
		t.Fatalf("Unexpected error: %v", err)
	}

	if len(list.Items) != 1 {
		t.Fatalf("there should be 1 binding left")
	}
}
