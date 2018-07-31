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

func TestListBuildsEndpoint(t *testing.T) {
	cases := []struct {
		Name                 string
		BuildLister          func() mobile.BuildLister
		ExpectItemsListSize  int
		ExpectHTTPStatusCode int
	}{
		{
			Name: "test list builds endpoint success",
			BuildLister: func() mobile.BuildLister {
				client := fake.NewSimpleClientset(&mobile.Build{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "build1",
						Namespace: "test",
					},
				})
				return mobile.NewBuildLister(client.BuildV1())
			},
			ExpectItemsListSize:  1,
			ExpectHTTPStatusCode: http.StatusOK,
		}, {
			Name: "testing list builds endpoint failure",
			BuildLister: func() mobile.BuildLister {
				client := fake.NewSimpleClientset()
				client.PrependReactor("list", "builds", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return mobile.NewBuildLister(client.BuildV1())
			},
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			listImpl := tc.BuildLister()
			h := NewMobileBuildsHandler(listImpl, "test")
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
				var buildList mobile.BuildList
				jerr := json.Unmarshal(rec.Body.Bytes(), &buildList)
				if jerr != nil {
					t.Fatalf("can not parse json data: %v", jerr)
				}
				if len(buildList.Items) != tc.ExpectItemsListSize {
					t.Fatalf("build list items size %v does not equal to %v", len(buildList.Items), tc.ExpectItemsListSize)
				}
			}
		})
	}
}
