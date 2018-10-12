package web

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

func setupServerAndRoute(apiPrefix string) *httptest.Server {
	h := NewUserHandler()

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupUserRouter(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestUserInfoEndpoint(t *testing.T) {
	cases := []struct {
		Name                   string
		ExpectedHTTPStatusCode int
		RequestHeaders         map[string]string
		ExpectedUserName       string
		ExpectedUserEmail      string
	}{
		{
			Name: "Test no header values",
			ExpectedHTTPStatusCode: 200,
			RequestHeaders:         nil,
			ExpectedUserName:       "Unknown",
			ExpectedUserEmail:      "Unknown",
		}, {
			Name: "Test both name and email header values exist",
			ExpectedHTTPStatusCode: 200,
			RequestHeaders: map[string]string{
				"X-Forwarded-User":  "testuser",
				"X-Forwarded-Email": "testemail",
			},
			ExpectedUserEmail: "testemail",
			ExpectedUserName:  "testuser",
		}, {
			Name: "Test only name values exist",
			ExpectedHTTPStatusCode: 200,
			RequestHeaders: map[string]string{
				"X-Forwarded-User":  "testuser",
				"X-Forwarded-Email": "",
			},
			ExpectedUserEmail: "Unknown",
			ExpectedUserName:  "testuser",
		}, {
			Name: "Test only email values exist",
			ExpectedHTTPStatusCode: 200,
			RequestHeaders: map[string]string{
				"X-Forwarded-Email": "testemail",
				"X-Forwarded-User":  "",
			},
			ExpectedUserEmail: "testemail",
			ExpectedUserName:  "Unknown",
		},
	}

	apiPrefix = "/api"

	server := setupServerAndRoute(apiPrefix)
	defer server.Close()

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			client := &http.Client{}
			req, _ := http.NewRequest("GET", fmt.Sprintf("%s%s/user", server.URL, apiPrefix), nil)
			if tc.RequestHeaders != nil {
				for name, value := range tc.RequestHeaders {
					req.Header.Set(name, value)
				}
			}
			res, err := client.Do(req)
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			defer res.Body.Close()
			if res.StatusCode != tc.ExpectedHTTPStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectedHTTPStatusCode, res.StatusCode)
			}
			var user User
			data, err := ioutil.ReadAll(res.Body)
			if err != nil {
				t.Fatalf("can not read http response: %v", err)
			}
			jerr := json.Unmarshal(data, &user)
			if jerr != nil {
				t.Fatalf("can not parse json data: %v", jerr)
			}
			if user.Name != tc.ExpectedUserName {
				t.Fatalf("Unexpected user name: %s", user.Name)
			}
			if user.Email != tc.ExpectedUserEmail {
				t.Fatalf("Unexpected user email: %s", user.Email)
			}
		})
	}

}
