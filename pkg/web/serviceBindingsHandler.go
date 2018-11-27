package web

import (
	"errors"
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
)

type BindableMobileServiceHandler struct {
	namespace            string
	bindableServiceCRUDL mobile.BindableMobileServiceCRUDL
	mobileClientRepo     mobile.MobileClientRepo
}

func NewMobileServiceBindingsHandler(bindableServiceCRUDL mobile.BindableMobileServiceCRUDL, mobileClientRepo mobile.MobileClientRepo, namespace string) *BindableMobileServiceHandler {
	return &BindableMobileServiceHandler{
		bindableServiceCRUDL: bindableServiceCRUDL,
		mobileClientRepo:     mobileClientRepo,
		namespace:            namespace,
	}
}

func (msih *BindableMobileServiceHandler) List(c echo.Context) error {
	mobileClientName := c.Param("name")
	mobileClient, err := msih.mobileClientRepo.ReadByName(mobileClientName)
	if err != nil {
		c.Logger().Errorf("can not read app with name %s due to error %v", mobileClientName, err)
		return c.String(http.StatusBadRequest, err.Error())
	}
	si, err := msih.bindableServiceCRUDL.List(mobileClient)
	if err != nil {
		c.Logger().Errorf("error listing service bindings %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, si)
}

func (msih *BindableMobileServiceHandler) Watch(c echo.Context) error {
	mobileClientName := c.Param("name")

	mobileClient, err := msih.mobileClientRepo.ReadByName(mobileClientName)
	if err != nil {
		c.Logger().Errorf("can not read app with name %s due to error %v", mobileClientName, err)
		return c.String(http.StatusBadRequest, err.Error())
	}

	getWatchInterface := msih.bindableServiceCRUDL.Watch(mobileClient)
	err = ServeWS(c, getWatchInterface)
	if err != nil {
		c.Logger().Errorf("error watching build configs: %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return nil
}

func (msih *BindableMobileServiceHandler) Delete(c echo.Context) error {
	name := c.Param("name")
	err := msih.bindableServiceCRUDL.Delete(msih.namespace, name)
	if err != nil {
		c.Logger().Errorf("error deleting service binding %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusOK)
}

func (msih *BindableMobileServiceHandler) Create(c echo.Context) error {
	reqData := new(mobile.ServiceBindingCreateRequest)
	if err := c.Bind(&reqData); err != nil {
		c.Logger().Errorf("Could not bind request to ServiceBindingCreateRequest %v", err)
		return c.String(http.StatusBadRequest, err.Error())
	}

	if err := c.Validate(reqData); err != nil {
		c.Logger().Errorf("Binding Creation failed validation %v", err)
		return c.String(http.StatusBadRequest, err.Error())
	}

	consumerID := reqData.FormData["CLIENT_ID"].(string)
	if consumerID == "" {
		err := errors.New("CLIENT_ID is empty")
		return c.String(http.StatusBadRequest, err.Error())
	}

	mobileClient, err := msih.mobileClientRepo.ReadByName(consumerID)
	if err != nil {
		c.Logger().Errorf("can not read app with name %s due to error %v", consumerID, err)
		return c.String(http.StatusBadRequest, err.Error())
	}

	binding := msih.bindableServiceCRUDL.NewBindingObject(*reqData, mobileClient)
	binding, err = msih.bindableServiceCRUDL.Create(binding, reqData.FormData)

	if err != nil {
		c.Logger().Errorf("error creating service binding %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(200, binding)
}
