package web

import (
	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
		"net/http"
)

type MobileClientsHandler struct {
	namespace string
	mobileClientRepo mobile.MobileClientRepo
}

func NewMobileClientsHandler(mobileClientRepo mobile.MobileClientRepo, namespace string) *MobileClientsHandler {
	return &MobileClientsHandler{
		namespace:namespace,
		mobileClientRepo:mobileClientRepo,
	}
}

type MobileAppCreateRequest struct {
	//has to be unique per namespace, can not be changed later
	Name string `json:"name,required"`
	ClientType string `json:"clientType,required"`
	AppIdentifier string `json:appIdentifier,required`
}

type MobileAppUpdateRequest struct {
	AppIdentifier string `json:appIdentifier`
}

func newMobileClientObject(data MobileAppCreateRequest, namespace string) *v1alpha1.MobileClient {
	return &v1alpha1.MobileClient{
		ObjectMeta: metav1.ObjectMeta{
			Name: data.Name,
			Namespace: namespace,
		},
		Spec:v1alpha1.MobileClientSpec{
			ClientType:data.ClientType,
			Name: data.Name,
			AppIdentifier: data.AppIdentifier,
		},
	}
}

func (h *MobileClientsHandler) Create(c echo.Context) error {
	reqData := new(MobileAppCreateRequest)
	if err := c.Bind(reqData); err != nil {
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
	app, err := h.mobileClientRepo.ReadByName(name)
	if err != nil {
		return err
	}
	if app == nil {
		return c.NoContent(http.StatusNotFound)
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