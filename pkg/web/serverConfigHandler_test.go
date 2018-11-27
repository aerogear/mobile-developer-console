package web

import (
	"fmt"
	"github.com/aerogear/mobile-developer-console/pkg/config"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func setupServerConfigHandler(apiPrefix string, config config.Config) *httptest.Server {
	h := NewServerConfigHandler(config)

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupServerConfigRouter(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestServerConfigEndpoint(t *testing.T) {
	cases := []struct {
		Name               string
		ExpectedStatusCode int
		ExpectedContent    string
		Config             config.Config
	}{
		{
			Name:               "Test build tabe is enabled",
			ExpectedStatusCode: 200,
			ExpectedContent:    "\"ENABLE_BUILD_TAB\":true",
			Config:             config.Config{BuildTabEnabled: true},
		},
		{
			Name:               "Test build tabe is disabled",
			ExpectedStatusCode: 200,
			ExpectedContent:    "\"ENABLE_BUILD_TAB\":false",
			Config:             config.Config{BuildTabEnabled: false},
		},
	}

	apiPrefix = "/api"

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			server := setupServerConfigHandler(apiPrefix, tc.Config)
			defer server.Close()

			client := &http.Client{}
			req, _ := http.NewRequest("GET", fmt.Sprintf("%s%s/server_config.js", server.URL, apiPrefix), nil)

			res, err := client.Do(req)
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			defer res.Body.Close()
			if res.StatusCode != tc.ExpectedStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectedStatusCode, res.StatusCode)
			}

			data, err := ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("can not read http response: %v", err)
			}
			if !strings.Contains(string(data), tc.ExpectedContent) {
				t.Fatalf("can not find expected content in the response: %s", string(data))
			}
		})
	}
}
