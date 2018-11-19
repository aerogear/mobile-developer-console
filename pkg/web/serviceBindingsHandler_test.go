package web

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"encoding/json"
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
)

const (
	SB_API_PREFIX = "/api"
	SB_TEST_NAMESPACE = "sbtest"
)

func setupServiceBindingServer(store mobile.BindableMobileServiceCRUDL, apiPrefix string) *httptest.Server {
	h := NewMobileServiceBindingsHandler(store, SB_TEST_NAMESPACE)

	r := NewRouter("", SB_API_PREFIX)
	apiRoute := r.Group(SB_API_PREFIX)

	SetupBindableMobileServiceRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestServiceBindingsEndpoints(t *testing.T) {
	cases := []struct{
		Name string
		GetResponse      func(server *httptest.Server) (*http.Response, error)
		ExpectError      bool
		ExpectStatusCode int
		ExpectListSize   int
		ValidateResponse func(t *testing.T, responseBody []byte) error
	}{
		{
			Name: "test create a binding",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/bindableservices",  server.URL, SB_API_PREFIX)
				jsonStr := []byte(`{"serviceInstanceName":"testInstance", "serviceClassExternalName": "testClass", "bindingParametersName": "testBindParameter", "bindingSecretName": "testBindSecretName", "formData":{"CLIENT_ID": "testapp"}}`)
				return http.Post(url, "application/json", bytes.NewBuffer(jsonStr))
			},
			ExpectError: false,
			ExpectStatusCode: 200,
			ExpectListSize: 0,
		},
		{
			Name: "test list bindings",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/bindableservices/testapp",  server.URL, SB_API_PREFIX)
				return http.Get(url)
			},
			ExpectError: false,
			ExpectStatusCode: 200,
			ExpectListSize: 1,
		},
		{
			Name: "test delete a binding",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				client := &http.Client{}
				url := fmt.Sprintf("%s%s/bindableservices/testapp",  server.URL, SB_API_PREFIX)
				req, err := http.NewRequest("DELETE", url, nil)
				if err != nil {
					return nil, err
				}
				return client.Do(req)
			},
			ExpectError: false,
			ExpectStatusCode: 200,
			ExpectListSize: 0,
		},

	}

	mockBindableServiceCRULD := mobile.NewMockBindableServices()
	server := setupServiceBindingServer(mockBindableServiceCRULD, SB_API_PREFIX)
	defer server.Close()

	for _, tc := range cases {
		res, err := tc.GetResponse(server)
		if err != nil && !tc.ExpectError {
			t.Fatalf("Unexpected error %v", err)
		}

		if tc.ExpectError && err == nil {
			t.Fatalf("Test case expected an error but got none")
		}

		if res.StatusCode != tc.ExpectStatusCode {
			t.Fatalf("expect http status code %v, but got %v", tc.ExpectStatusCode, res.StatusCode)
		}

		data, err := ioutil.ReadAll(res.Body)
		if err != nil {
			t.Fatalf("can not read http response: %v", err)
		}

		if tc.ExpectListSize > 0 {
			var list mobile.BindableMobileServiceList
			jerr := json.Unmarshal(data, &list)
			if jerr != nil {
				t.Fatalf("can not parse json data: %v", jerr)
			}
			if len(list.Items) != tc.ExpectListSize {
				t.Fatalf("bindings list items size %v does not equal to %v", len(list.Items), tc.ExpectListSize)
			}
		}
	}
}