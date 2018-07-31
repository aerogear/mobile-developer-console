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

	mobile "github.com/aerogear/mobile-client-service/pkg/mobile"

	"github.com/labstack/echo"
	"github.com/openshift/client-go/build/clientset/versioned/fake"
)

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

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			listImpl := tc.BuildConfigLister()
			h := NewMobileBuildConfigsHandler(listImpl, "test")
			// Setup
			e := echo.New()
			req := httptest.NewRequest(echo.GET, "/", nil)
			rec := httptest.NewRecorder()
			c := e.NewContext(req, rec)
			c.SetPath("/")
			err := h.List(c)
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}

			if rec.Code != tc.ExpectHTTPStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectHTTPStatusCode, rec.Code)
			}

			if tc.ExpectItemsListSize > 0 {
				var items mobile.BuildConfigList
				jerr := json.Unmarshal(rec.Body.Bytes(), &items)
				if jerr != nil {
					t.Fatalf("can not parse json data: %v", jerr)
				}
				if len(items.Items) != tc.ExpectItemsListSize {
					t.Fatalf("build list items size %v does not equal to %v", len(items.Items), tc.ExpectItemsListSize)
				}
			}
		})
	}
}
