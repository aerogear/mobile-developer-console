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
			c := NewServiceBindingLister(scClient, nil, secretClient)
			binding := &ServiceBinding{
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
			sb, err := c.Create(namespace, binding, formData)
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
			crudl := NewServiceBindingLister(scClient, nil, secretClient)

			result, err := crudl.Watch(namespace, "testapp")()
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
			c := NewServiceBindingLister(scClient, nil, nil)
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
	app := &v1alpha1.MobileClient{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testapp",
			Namespace: namespace,
		},
	}

	serviceClass1 := newClusterServiceClass("serviceclass1")
	servicePlan1 := newClusterServicePlan("serviceplan1", "serviceclass1")
	serviceInstance1 := newServiceInstance("serviceinstance1", "serviceclass1")
	serviceBinding1 := newSerivceBinding("serviceBinding1", "serviceinstance1", sctypes.ConditionTrue)

	serviceClass2 := newClusterServiceClass("serviceclass2")
	servicePlan2 := newClusterServicePlan("serviceplan2", "serviceclass2")
	serviceInstance2 := newServiceInstance("serviceinstance2", "serviceclass2")
	serviceBinding2 := newSerivceBinding("serviceBinding2", "serviceinstance2", sctypes.ConditionFalse)

	cases := []struct {
		Name             string
		ExpectError      bool
		SCClient         v1beta1.ServicecatalogV1beta1Interface
		MobileClientRepo MobileClientRepo
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
			MobileClientRepo: NewMockMobileClientRepo(app),
		},
	}
	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			scClient := tc.SCClient
			c := NewServiceBindingLister(scClient, tc.MobileClientRepo, nil)
			bindableServiceList, err := c.List(namespace, "testapp")
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			if len(bindableServiceList.Items) != 2 {
				t.Fatalf("there should be 2 bindable services returned")
			}
			if bindableServiceList.Items[0].IsBound == bindableServiceList.Items[1].IsBound {
				t.Fatalf("the isBound status should be different for the 2 BindableServices")
			}
		})
	}
}
