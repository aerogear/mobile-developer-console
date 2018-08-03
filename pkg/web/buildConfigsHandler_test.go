package web

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	ktesting "k8s.io/client-go/testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	"github.com/aerogear/mobile-client-service/pkg/mobile"

	"fmt"
	"github.com/openshift/client-go/build/clientset/versioned/fake"
	"io/ioutil"
)

func setupBuildConfigsServer(lister mobile.BuildConfigLister, apiPrefix string) *httptest.Server {
	h := NewMobileBuildConfigsHandler(lister, "test")

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupMobileBuildConfigsRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestListBuildConfigsEndpoint(t *testing.T) {
	cases := []struct {
		Name                 string
		BuildConfigLister    func() mobile.BuildConfigLister
		ExpectItemsListSize  int
		ExpectHTTPStatusCode int
	}{
		{
			Name: "test list build configs endpoint success",
			BuildConfigLister: func() mobile.BuildConfigLister {
				client := fake.NewSimpleClientset(&mobile.BuildConfig{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "buildconfig1",
						Namespace: "test",
					},
				})
				return mobile.NewBuildConfigLister(client.BuildV1())
			},
			ExpectItemsListSize:  1,
			ExpectHTTPStatusCode: http.StatusOK,
		}, {
			Name: "testing list build configs endpoint failure",
			BuildConfigLister: func() mobile.BuildConfigLister {
				client := fake.NewSimpleClientset()
				client.PrependReactor("list", "buildconfigs", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return mobile.NewBuildConfigLister(client.BuildV1())
			},
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
	}

	apiPrefix := "/api"

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			listImpl := tc.BuildConfigLister()
			server := setupBuildConfigsServer(listImpl, apiPrefix)
			defer server.Close()

			res, err := http.Get(fmt.Sprintf("%s%s/buildconfigs", server.URL, apiPrefix))
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			defer res.Body.Close()

			if res.StatusCode != tc.ExpectHTTPStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectHTTPStatusCode, res.StatusCode)
			}

			if tc.ExpectItemsListSize > 0 {
				var list mobile.BuildConfigList
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
