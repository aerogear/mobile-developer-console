package web

import (
	"fmt"
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"net/http"
	"net/http/httptest"
	"testing"
)

type mockAppDeleter struct {
}

func (d *mockAppDeleter) Delete(mobileClient *v1alpha1.MobileClient) error {
	return nil
}

func setupDeleteMobileRouteSever(mobileClientRepo mobile.MobileClientRepo, appDeleter mobile.AppDeleter, apiPrefix string) *httptest.Server {
	h := NewDeleteMobileClientHander(mobileClientRepo, appDeleter)

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupDeleteMobileClientRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestDeleteMobileClientHandler_Delete(t *testing.T) {

	apiPrefx := "/api"

	cases := []struct {
		Name             string
		GetResponse      func(server *httptest.Server) (*http.Response, error)
		ExpectError      bool
		ExpectStatusCode int
		ClientId         string
	}{
		{
			Name:             "test delete invalid app",
			ClientId:         "invalidId",
			ExpectError:      false,
			ExpectStatusCode: 400,
		}, {
			Name:             "test delete valid app",
			ClientId:         "testapp",
			ExpectError:      false,
			ExpectStatusCode: 200,
		},
	}

	mc := &v1alpha1.MobileClient{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testapp",
			Namespace: "test",
		},
	}

	mobileClientsRepo := mobile.NewMockMobileClientRepo(mc)
	appDataDeleter := &mockAppDeleter{}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			server := setupDeleteMobileRouteSever(mobileClientsRepo, appDataDeleter, apiPrefx)
			defer server.Close()

			client := &http.Client{}
			url := fmt.Sprintf("%s%s/mobileclients/%s", server.URL, apiPrefix, tc.ClientId)
			req, err := http.NewRequest("DELETE", url, nil)
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			res, err := client.Do(req)
			if err != nil && !tc.ExpectError {
				t.Fatalf("Unexpected error %v", err)
			}

			if tc.ExpectError && err == nil {
				t.Fatalf("Test case expected an error but got none")
			}

			if res.StatusCode != tc.ExpectStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectStatusCode, res.StatusCode)
			}
		})
	}

}
