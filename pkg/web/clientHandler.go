package web

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// TODO: Mocked data for now.
var mobileClients = `
{
	"apiVersion": "v1",
	"items": [
			{
					"apiVersion": "mobile.k8s.io/v1alpha1",
					"kind": "MobileClient",
					"metadata": {
							"annotations": {
									"aerogear.org/service-instance-name": "dh-android-app-apb-4hxhp",
									"icon": "fa fa-android"
							},
							"clusterName": "",
							"creationTimestamp": "2018-07-25T21:10:17Z",
							"name": "myapp-android",
							"namespace": "test",
							"resourceVersion": "2669",
							"selfLink": "/apis/mobile.k8s.io/v1alpha1/namespaces/test/mobileclients/myapp-android",
							"uid": "21830e50-904f-11e8-8ef3-c85b76719196"
					},
					"spec": {
							"apiKey": "874e600e-3527-5e2a-a0a4-a530f7899c74",
							"appIdentifier": "dwqwdwqdw",
							"clientType": "android",
							"name": "myapp"
					}
			},
			{
					"apiVersion": "mobile.k8s.io/v1alpha1",
					"kind": "MobileClient",
					"metadata": {
							"annotations": {
									"aerogear.org/service-instance-name": "dh-cordova-app-apb-5x5g5",
									"icon": "font-icon icon-cordova"
							},
							"clusterName": "",
							"creationTimestamp": "2018-07-25T21:11:27Z",
							"name": "myapp-cordova",
							"namespace": "test",
							"resourceVersion": "2936",
							"selfLink": "/apis/mobile.k8s.io/v1alpha1/namespaces/test/mobileclients/myapp-cordova",
							"uid": "4b3dd562-904f-11e8-8ef3-c85b76719196"
					},
					"spec": {
							"apiKey": "ef625905-5581-5769-bbd5-4343ce79eb3e",
							"appIdentifier": "e32e32e32e",
							"clientType": "cordova",
							"name": "myapp"
					}
			},
			{
					"apiVersion": "mobile.k8s.io/v1alpha1",
					"kind": "MobileClient",
					"metadata": {
							"annotations": {
									"aerogear.org/service-instance-name": "dh-ios-app-apb-kp279",
									"icon": "fa fa-apple"
							},
							"clusterName": "",
							"creationTimestamp": "2018-07-25T21:11:35Z",
							"name": "myapp-ios",
							"namespace": "test",
							"resourceVersion": "3046",
							"selfLink": "/apis/mobile.k8s.io/v1alpha1/namespaces/test/mobileclients/myapp-ios",
							"uid": "500428bb-904f-11e8-8ef3-c85b76719196"
					},
					"spec": {
							"apiKey": "fe880376-28c8-557c-92d9-2b0ab156374c",
							"appIdentifier": "e32e32e32e32",
							"clientType": "iOS",
							"name": "myapp"
					}
			},
			{
					"apiVersion": "mobile.k8s.io/v1alpha1",
					"kind": "MobileClient",
					"metadata": {
							"annotations": {
									"aerogear.org/service-instance-name": "dh-xamarin-app-apb-zjrpk",
									"icon": "font-icon icon-xamarin"
							},
							"clusterName": "",
							"creationTimestamp": "2018-07-25T21:11:45Z",
							"name": "myapp-xamarin",
							"namespace": "test",
							"resourceVersion": "3112",
							"selfLink": "/apis/mobile.k8s.io/v1alpha1/namespaces/test/mobileclients/myapp-xamarin",
							"uid": "55d11b54-904f-11e8-8ef3-c85b76719196"
					},
					"spec": {
							"apiKey": "938395d6-6b2d-5e7a-9763-24475ecdc6a3",
							"appIdentifier": "3e32e32e32e",
							"clientType": "xamarin",
							"name": "myapp"
					}
			}
	],
	"kind": "List",
	"metadata": {
			"resourceVersion": "",
			"selfLink": ""
	}
}`

// SetClientRoutes sets routes for mobile clients
func SetClientRoutes(router *echo.Group) {
	router.GET("/mobile.k8s.io/v1alpha1/namespaces/:project/mobileclients", func(context echo.Context) error {
		if context.QueryParam("watch") == "true" {
			return watchClients(context, context.Param("resourceVersion"))
		}

		return listClients(context)
	})
}

func listClients(context echo.Context) error {
	return context.String(http.StatusOK, mobileClients)
}

func watchClients(context echo.Context, resourceVersion string) error {
	// TODO: Store open connections.
	ws, err := upgrader.Upgrade(context.Response(), context.Request(), nil)
	if err != nil {
		return err
	}

	// TODO: Manage closing connections.
	defer ws.Close()

	err = ws.WriteMessage(websocket.TextMessage, []byte(mobileClients))
	if err != nil {
		context.Logger().Error(err)
		return err
	}

	return nil
}
