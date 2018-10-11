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
