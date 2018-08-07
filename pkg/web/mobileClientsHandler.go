package web

import (
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"net/http"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

type MobileClientsHandler struct {
	namespace        string
	mobileClientRepo mobile.MobileClientRepo
}

func NewMobileClientsHandler(mobileClientRepo mobile.MobileClientRepo, namespace string) *MobileClientsHandler {
	return &MobileClientsHandler{
		namespace:        namespace,
		mobileClientRepo: mobileClientRepo,
	}
}

type MobileAppCreateRequest struct {
	//has to be unique per namespace, can not be changed later
	Name          string `json:"name" validate:"required"`
	ClientType    string `json:"clientType" validate:"required,oneof=android iOS cordova xamarin"`
	AppIdentifier string `json:"appIdentifier"" validate:"required"`
	DmzUrl        string `json:"dmzUrl"`
}

type MobileAppUpdateRequest struct {
	AppIdentifier string `json:"appIdentifier" validate:"required"`
}

func newMobileClientObject(data MobileAppCreateRequest, namespace string) *v1alpha1.MobileClient {
	return &v1alpha1.MobileClient{
		TypeMeta: metav1.TypeMeta{
			Kind:       "MobileClient",
			APIVersion: "mobile.k8s.io/v1alpha1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      data.Name,
			Namespace: namespace,
		},
		Spec: v1alpha1.MobileClientSpec{
			ClientType:    data.ClientType,
			Name:          data.Name,
			AppIdentifier: data.AppIdentifier,
			ApiKey:        uuid.NewV4().String(),
			DmzUrl:        data.DmzUrl,
		},
	}
}

func isNotFoundError(e error) bool {
	switch t := e.(type) {
	case *errors.StatusError:
		if t.ErrStatus.Reason == metav1.StatusReasonNotFound {
			return true
		}
		return false
	default:
		return false
	}
}

func (h *MobileClientsHandler) Create(c echo.Context) error {
	reqData := new(MobileAppCreateRequest)
	if err := c.Bind(reqData); err != nil {
		return err
	}
	if err := c.Validate(reqData); err != nil {
		return err
	}
	app := newMobileClientObject(*reqData, h.namespace)
	err := h.mobileClientRepo.Create(app)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, app)
}

func (h *MobileClientsHandler) Read(c echo.Context) error {
	name := c.Param("name")
	app, err := h.mobileClientRepo.ReadByName(name)
	if err != nil {
		if isNotFoundError(err) {
			return c.NoContent(http.StatusNotFound)
		}
		return err
	}
	return c.JSON(http.StatusOK, app)
}

func (h *MobileClientsHandler) List(c echo.Context) error {
	apps, err := h.mobileClientRepo.List(h.namespace)
	if err != nil {
		return err
	}
	return c.JSON(http.StatusOK, apps)
}

func (h *MobileClientsHandler) Update(c echo.Context) error {
	name := c.Param("name")
	reqData := new(MobileAppUpdateRequest)
	if err := c.Bind(reqData); err != nil {
		return err
	}
	if err := c.Validate(reqData); err != nil {
		return err
	}
	app, err := h.mobileClientRepo.ReadByName(name)
	if err != nil {
		if isNotFoundError(err) {
			return c.NoContent(http.StatusNotFound)
		}
		return err
	}
	if reqData.AppIdentifier != "" {
		app.Spec.AppIdentifier = reqData.AppIdentifier
	}
	uerr := h.mobileClientRepo.Update(app)
	if uerr != nil {
		return uerr
	}
	return c.JSON(http.StatusOK, app)
}

func (h *MobileClientsHandler) Delete(c echo.Context) error {
	name := c.Param("name")
	err := h.mobileClientRepo.DeleteByName(name)
	if err != nil {
		return err
	}
	return c.NoContent(http.StatusOK)
}

func (h *MobileClientsHandler) Watch(context echo.Context) error {
	// TODO: Store open connections.
	ws, err := upgrader.Upgrade(context.Response(), context.Request(), nil)
	if err != nil {
		return err
	}

	// TODO: Manage closing connections.
	defer ws.Close()

	err = ws.WriteMessage(websocket.TextMessage, []byte(""))
	if err != nil {
		context.Logger().Error(err)
		return err
	}

	return nil
}
