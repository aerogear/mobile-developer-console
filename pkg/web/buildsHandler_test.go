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
	"io/ioutil"

	"github.com/openshift/client-go/build/clientset/versioned/fake"
)

func setupBuildsServer(crudl mobile.BuildCRUDL, apiPrefix string) *httptest.Server {
	h := NewMobileBuildsHandler(crudl, "test")

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupMobileBuildsRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestListBuildsEndpoint(t *testing.T) {
	cases := []struct {
		Name                 string
		BuildCRUDL           func() mobile.BuildCRUDL
		ExpectItemsListSize  int
		ExpectHTTPStatusCode int
	}{
		{
			Name: "test list builds endpoint success",
			BuildCRUDL: func() mobile.BuildCRUDL {
				client := fake.NewSimpleClientset(&mobile.Build{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "build1",
						Namespace: "test",
					},
				})
				return mobile.NewBuildCRUDL(client.BuildV1())
			},
			ExpectItemsListSize:  1,
			ExpectHTTPStatusCode: http.StatusOK,
		}, {
			Name: "testing list builds endpoint failure",
			BuildCRUDL: func() mobile.BuildCRUDL {
				client := fake.NewSimpleClientset()
				client.PrependReactor("list", "builds", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return mobile.NewBuildCRUDL(client.BuildV1())
			},
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
	}

	apiPrefix := "/api"

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			listImpl := tc.BuildCRUDL()
			server := setupBuildsServer(listImpl, apiPrefix)
			defer server.Close()

			res, err := http.Get(fmt.Sprintf("%s%s/builds", server.URL, apiPrefix))
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			defer res.Body.Close()

			if res.StatusCode != tc.ExpectHTTPStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectHTTPStatusCode, res.StatusCode)
			}

			if tc.ExpectItemsListSize > 0 {
				var list mobile.BuildList
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
