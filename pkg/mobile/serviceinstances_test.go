package mobile

import (
	"errors"
	"testing"

	scapisv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	fakesc "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/fake"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/typed/servicecatalog/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	ktesting "k8s.io/client-go/testing"
)

func TestListMobileServiceInstaces(t *testing.T) {
	cases := []struct {
		Name             string
		ExpectError      bool
		Client           func() scv1beta1.ServicecatalogV1beta1Interface
		ExpectedListSize int
	}{
		{
			Name:        "List mobile service instances",
			ExpectError: false,
			Client: func() scv1beta1.ServicecatalogV1beta1Interface {
				client := fakesc.NewSimpleClientset(&ServiceInstance{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "serviceinstance1",
						Namespace: "test",
					},
					Spec: scapisv1beta1.ServiceInstanceSpec{
						ClusterServiceClassRef: &scapisv1beta1.ClusterObjectReference{
							Name: "testclass",
						},
					},
				}, &scapisv1beta1.ClusterServiceClass{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "testclass",
						Namespace: "test",
					},
					Spec: scapisv1beta1.ClusterServiceClassSpec{
						CommonServiceClassSpec: scapisv1beta1.CommonServiceClassSpec{
							Tags: []string{"mobile-service"},
						},
					},
				}, &scapisv1beta1.ClusterServiceClass{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "testclass1",
						Namespace: "test",
					},
					Spec: scapisv1beta1.ClusterServiceClassSpec{
						CommonServiceClassSpec: scapisv1beta1.CommonServiceClassSpec{
							Tags: []string{},
						},
					},
				})
				return client.ServicecatalogV1beta1()
			},
			ExpectedListSize: 1,
		}, {
			Name:        "List mobile service instances error",
			ExpectError: true,
			Client: func() scv1beta1.ServicecatalogV1beta1Interface {
				client := fakesc.NewSimpleClientset()
				client.PrependReactor("list", "serviceinstances", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return client.ServicecatalogV1beta1()
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			listImpl := NewServiceInstanceLister(tc.Client())
			objList, err := listImpl.List("test")
			if tc.ExpectError && err == nil {
				t.Fatalf("expected an error but got none")
			}
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			if objList != nil && len(objList.Items) != tc.ExpectedListSize {
				t.Fatalf("list items size %v does not equal to %v", len(objList.Items), tc.ExpectedListSize)
			}
		})
	}
}
