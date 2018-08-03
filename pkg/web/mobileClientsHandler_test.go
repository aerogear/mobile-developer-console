package web

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"io/ioutil"
	errors2 "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"net/http"
	"net/http/httptest"
	"testing"
)

type mockMobileClientRepo struct {
	mockStore map[string]*v1alpha1.MobileClient
}

func NewMockMobileClientRepo() *mockMobileClientRepo {
	repo := &mockMobileClientRepo{}
	repo.mockStore = make(map[string]*v1alpha1.MobileClient)
	return repo
}

func (r *mockMobileClientRepo) Create(app *v1alpha1.MobileClient) error {
	name := app.Name
	r.mockStore[name] = app
	return nil
}

func (r *mockMobileClientRepo) ReadByName(name string) (*v1alpha1.MobileClient, error) {
	app := r.mockStore[name]
	if app != nil {
		return app, nil
	}
	return nil, &errors2.StatusError{ErrStatus: v1.Status{
		Reason: v1.StatusReasonNotFound,
	}}
}

func (r *mockMobileClientRepo) Update(app *v1alpha1.MobileClient) error {
	name := app.Name
	if r.mockStore[name] != nil {
		r.mockStore[name] = app
		return nil
	}
	return &errors2.StatusError{ErrStatus: v1.Status{
		Reason: v1.StatusReasonNotFound,
	}}
}

func (r *mockMobileClientRepo) List(namespace string) (*v1alpha1.MobileClientList, error) {
	items := make([]v1alpha1.MobileClient, 0)
	for _, app := range r.mockStore {
		items = append(items, *app)
	}
	return &v1alpha1.MobileClientList{
		Items: items,
	}, nil
}

func (r *mockMobileClientRepo) DeleteByName(name string) error {
	delete(r.mockStore, name)
	return nil
}

var apiPrefix = "/api"

func setupMobileClientsServer(repo mobile.MobileClientRepo, apiPrefix string) *httptest.Server {
	h := NewMobileClientsHandler(repo, "test")

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupMoileClientsRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestMobileClientEndpoints(t *testing.T) {
	cases := []struct {
		Name             string
		GetResponse      func(server *httptest.Server) (*http.Response, error)
		ExpectError      bool
		ExpectStatusCode int
		ExpectListSize   int
	}{
		{
			Name: "test list mobile clients",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/mobileclients", server.URL, apiPrefix)
				return http.Get(url)
			},
			ExpectError:      false,
			ExpectStatusCode: http.StatusOK,
			ExpectListSize:   0,
		},
		{
			Name: "test create a mobile client with invalid data",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/mobileclients", server.URL, apiPrefix)
				var jsonStr = []byte(`{"clientType":"android"}`)
				return http.Post(url, "application/json", bytes.NewBuffer(jsonStr))
			},
			ExpectError:      false,
			ExpectStatusCode: 500,
			ExpectListSize:   0,
		},
		{
			Name: "test create a mobile client",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/mobileclients", server.URL, apiPrefix)
				var jsonStr = []byte(`{"clientType":"android", "name":"testapp","appIdentifier":"testAppId"}`)
				return http.Post(url, "application/json", bytes.NewBuffer(jsonStr))
			},
			ExpectError:      false,
			ExpectStatusCode: 200,
			ExpectListSize:   0,
		},
		{
			Name: "test read a mobile client",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/mobileclients/testapp", server.URL, apiPrefix)
				return http.Get(url)
			},
			ExpectError:      false,
			ExpectStatusCode: 200,
			ExpectListSize:   0,
		},
		{
			Name: "test read a non-exist mobile client",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/mobileclients/notexist", server.URL, apiPrefix)
				return http.Get(url)
			},
			ExpectError:      false,
			ExpectStatusCode: 404,
			ExpectListSize:   0,
		},
		{
			Name: "test list mobile clients again",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				url := fmt.Sprintf("%s%s/mobileclients", server.URL, apiPrefix)
				return http.Get(url)
			},
			ExpectError:      false,
			ExpectStatusCode: http.StatusOK,
			ExpectListSize:   1,
		},
		{
			Name: "test delete a mobile client",
			GetResponse: func(server *httptest.Server) (*http.Response, error) {
				client := &http.Client{}
				url := fmt.Sprintf("%s%s/mobileclients/testapp", server.URL, apiPrefix)
				req, err := http.NewRequest("DELETE", url, nil)
				if err != nil {
					return nil, err
				}
				return client.Do(req)
			},
			ExpectError:      false,
			ExpectStatusCode: http.StatusOK,
			ExpectListSize:   0,
		},
	}

	mockAppRepo := NewMockMobileClientRepo()

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {

			server := setupMobileClientsServer(mockAppRepo, apiPrefix)
			defer server.Close()

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

			if tc.ExpectListSize > 0 {
				var list v1alpha1.MobileClientList
				data, err := ioutil.ReadAll(res.Body)
				if err != nil {
					t.Fatalf("can not read http response: %v", err)
				}
				jerr := json.Unmarshal(data, &list)
				if jerr != nil {
					t.Fatalf("can not parse json data: %v", jerr)
				}
				if len(list.Items) != tc.ExpectListSize {
					t.Fatalf("build list items size %v does not equal to %v", len(list.Items), tc.ExpectListSize)
				}
			}
		})
	}
}
