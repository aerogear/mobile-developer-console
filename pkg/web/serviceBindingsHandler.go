package web

import (
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
)

type BindableMobileServiceHandler struct {
	namespace             string
	bindableServiceLister mobile.BindableMobileServiceLister
}

func NewMobileServiceBindingsHandler(bindableServiceLister mobile.BindableMobileServiceLister, namespace string) *BindableMobileServiceHandler {
	return &BindableMobileServiceHandler{
		bindableServiceLister: bindableServiceLister,
		namespace:             namespace,
	}
}

func (msih *BindableMobileServiceHandler) List(c echo.Context) error {
	si, err := msih.bindableServiceLister.List(msih.namespace)
	if err != nil {
		c.Logger().Errorf("error listing service bindings %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, si)
}

func (msih *BindableMobileServiceHandler) Create(c echo.Context) error {
	reqData := new(ServiceBindingRequest)
	// if err := c.Bind(reqData); err != nil {
	// 	return err
	// }
	// if err := c.Validate(reqData); err != nil {
	// 	return err
	// }
	// app := newMobileClientObject(*reqData, h.namespace)
	// err := h.mobileClientRepo.Create(app)
	// if err != nil {
	// 	return c.String(http.StatusBadRequest, err.Error())
	// }
	// data, err := newMoileClientDataFromObject(app)
	// if err != nil {
	// 	return err
	// }
	// return c.JSON(http.StatusOK, data)
}
