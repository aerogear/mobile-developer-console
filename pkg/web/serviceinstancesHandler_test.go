package web

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	ktesting "k8s.io/client-go/testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"

	scapisv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	fakesc "github.com/kubernetes-incubator/service-catalog/pkg/client/clientset_generated/clientset/fake"
)

func setupServiceInstancesServer(lister mobile.ServiceInstanceLister, apiPrefix string) *httptest.Server {
	h := NewMobileServiceInstancesHandler(lister, "test")

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupMobileServicesRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestListServiceInstancesEndpoint(t *testing.T) {
	cases := []struct {
		Name                   string
		ServiceInstancesLister func() mobile.ServiceInstanceLister
		ExpectItemsListSize    int
		ExpectHTTPStatusCode   int
	}{
		{
			Name: "test list service instances endpoint success",
			ServiceInstancesLister: func() mobile.ServiceInstanceLister {
				client := fakesc.NewSimpleClientset(&mobile.ServiceInstance{
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
				})
				return mobile.NewServiceInstanceLister(client.ServicecatalogV1beta1(), "test")
			},
			ExpectItemsListSize:  1,
			ExpectHTTPStatusCode: http.StatusOK,
		}, {
			Name: "testing list builds endpoint failure",
			ServiceInstancesLister: func() mobile.ServiceInstanceLister {
				client := fakesc.NewSimpleClientset()
				client.PrependReactor("list", "serviceinstances", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return mobile.NewServiceInstanceLister(client.ServicecatalogV1beta1(), "test")
			},
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
	}

	apiPrefix := "/api"

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			listImpl := tc.ServiceInstancesLister()

			server := setupServiceInstancesServer(listImpl, apiPrefix)
			defer server.Close()

			res, err := http.Get(fmt.Sprintf("%s%s/serviceinstances", server.URL, apiPrefix))
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			defer res.Body.Close()

			if res.StatusCode != tc.ExpectHTTPStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectHTTPStatusCode, res.StatusCode)
			}

			if tc.ExpectItemsListSize > 0 {
				var list mobile.ServiceInstanceList
				data, err := ioutil.ReadAll(res.Body)
				if err != nil {
					t.Fatalf("can not read http response: %v", err)
				}
				jerr := json.Unmarshal(data, &list)
				if jerr != nil {
					t.Fatalf("can not parse json data: %v", jerr)
				}
				if len(list.Items) != tc.ExpectItemsListSize {
					t.Fatalf("build list items size %v does not equal to %v", len(list.Items), tc.ExpectItemsListSize)
				}
			}
		})
	}
}
