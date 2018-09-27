package web

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	ktesting "k8s.io/client-go/testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"

	"fmt"
	"io/ioutil"

	"github.com/openshift/client-go/build/clientset/versioned/fake"
	k8sFake "k8s.io/client-go/kubernetes/fake"
)

func setupBuildConfigsServer(crudl mobile.BuildConfigCRUDL, sCrudl mobile.SecretsCRUDL, apiPrefix string) *httptest.Server {
	h := NewMobileBuildConfigsHandler(crudl, sCrudl, "test")

	r := NewRouter("", apiPrefix)
	apiRoute := r.Group(apiPrefix)

	SetupMobileBuildConfigsRoute(apiRoute, h)
	server := httptest.NewServer(r)
	return server
}

func TestListBuildConfigsEndpoint(t *testing.T) {
	cases := []struct {
		Name                 string
		BuildConfigCRUDL     func() mobile.BuildConfigCRUDL
		ExpectItemsListSize  int
		ExpectHTTPStatusCode int
	}{
		{
			Name: "test list build configs endpoint success",
			BuildConfigCRUDL: func() mobile.BuildConfigCRUDL {
				client := fake.NewSimpleClientset(&mobile.BuildConfig{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "buildconfig1",
						Namespace: "test",
					},
				})
				return mobile.NewBuildConfigCRUDL(client.BuildV1())
			},
			ExpectItemsListSize:  1,
			ExpectHTTPStatusCode: http.StatusOK,
		}, {
			Name: "testing list build configs endpoint failure",
			BuildConfigCRUDL: func() mobile.BuildConfigCRUDL {
				client := fake.NewSimpleClientset()
				client.PrependReactor("list", "buildconfigs", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return mobile.NewBuildConfigCRUDL(client.BuildV1())
			},
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
	}

	apiPrefix := "/api"

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			crudlImpl := tc.BuildConfigCRUDL()
			simpleClient := k8sFake.NewSimpleClientset()
			sCrudlImpl := mobile.NewSecretsCRUDL(simpleClient.CoreV1())
			server := setupBuildConfigsServer(crudlImpl, sCrudlImpl, apiPrefix)
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

func TestCreateBuildConfigEndpoint(t *testing.T) {
	cases := []struct {
		Name                 string
		BuildConfigCRUDL     func() mobile.BuildConfigCRUDL
		JSONBody             []byte
		ExpectHTTPStatusCode int
	}{
		{
			Name: "test create build config - basic",
			JSONBody: []byte(`{
				"name": "test",
				"clientId": "myapp-cordova",
				"clientType": "cordova",
				"source": {
					"gitUrl": "https://github.com/aerogear/cordova-showcase-template.git",
					"gitRef": "master",
					"jenkinsFilePath": "Jenkinsfile",
					"authType": "public"
				},
				"build": {
					"platform": "android",
					"buildType": "debug"
				}
			}`),
			ExpectHTTPStatusCode: http.StatusOK,
		},
		{
			Name: "test create build config - git basic auth",
			JSONBody: []byte(`{
				"name": "test",
				"clientId": "myapp-cordova",
				"clientType": "cordova",
				"source": {
					"gitUrl": "https://github.com/aerogear/cordova-showcase-template.git",
					"gitRef": "master",
					"jenkinsFilePath": "Jenkinsfile",
					"authType": "basic",
					"basicAuth": {
						"name": "test-auth-secret",
						"username": "myuser",
						"password": "mypass"
					}
				},
				"build": {
					"platform": "android",
					"buildType": "debug"
				}
			}`),
			ExpectHTTPStatusCode: http.StatusOK,
		},
		{
			Name: "test create build config - missing git auth",
			JSONBody: []byte(`{
				"name": "test",
				"clientId": "myapp-cordova",
				"clientType": "cordova",
				"source": {
					"gitUrl": "https://github.com/aerogear/cordova-showcase-template.git",
					"gitRef": "master",
					"jenkinsFilePath": "Jenkinsfile",
					"authType": "ssh"
				},
				"build": {
					"platform": "android",
					"buildType": "debug"
				}
			}`),
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
		{
			Name: "test create build config - ios credentials",
			JSONBody: []byte(`{
				"name": "test",
				"clientId": "myapp-cordova",
				"clientType": "cordova",
				"source": {
					"gitUrl": "https://github.com/aerogear/cordova-showcase-template.git",
					"gitRef": "master",
					"jenkinsFilePath": "Jenkinsfile",
					"authType": "public"
				},
				"build": {
					"platform": "iOS",
					"buildType": "debug",
					"iosCredentials": {
						"name": "test",
						"developerProfile": "test",
						"profilePassword": "test"
					}
				}
			}`),
			ExpectHTTPStatusCode: http.StatusOK,
		},
		{
			Name: "test create build config - missing ios credentials",
			JSONBody: []byte(`{
				"name": "test",
				"clientId": "myapp-cordova",
				"clientType": "cordova",
				"source": {
					"gitUrl": "https://github.com/aerogear/cordova-showcase-template.git",
					"gitRef": "master",
					"jenkinsFilePath": "Jenkinsfile",
					"authType": "public"
				},
				"build": {
					"platform": "iOS",
					"buildType": "debug",
					"iosCredentials": {
						"name": "test",
						"developerProfile": "test"
					}
				}
			}`),
			ExpectHTTPStatusCode: http.StatusInternalServerError,
		},
	}

	apiPrefix := "/api"

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			simpleClient := fake.NewSimpleClientset()
			crudlImpl := mobile.NewBuildConfigCRUDL(simpleClient.BuildV1())
			sSimpleClient := k8sFake.NewSimpleClientset()
			sCrudlImpl := mobile.NewSecretsCRUDL(sSimpleClient.CoreV1())
			server := setupBuildConfigsServer(crudlImpl, sCrudlImpl, apiPrefix)
			defer server.Close()

			url := fmt.Sprintf("%s%s/buildconfigs", server.URL, apiPrefix)
			req, err := http.NewRequest("POST", url, bytes.NewBuffer(tc.JSONBody))
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			req.Header.Set("Content-Type", "application/json")

			client := &http.Client{}
			res, err := client.Do(req)
			if err != nil {
				t.Fatalf("Unexpected error %v", err)
			}
			defer res.Body.Close()

			if res.StatusCode != tc.ExpectHTTPStatusCode {
				t.Fatalf("expect http status code %v, but got %v", tc.ExpectHTTPStatusCode, res.StatusCode)
			}
		})
	}
}
