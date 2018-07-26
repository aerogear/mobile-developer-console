package web

import (
	"net/http"

	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileServiceHandler struct {
	namespace           string
	mobileServiceLister mobile.ServiceLister
}

func NewMobileServiceHandler(serviceLister mobile.ServiceLister, namespace string) *MobileServiceHandler {
	return &MobileServiceHandler{
		mobileServiceLister: serviceLister,
		namespace:           namespace,
	}
}

func (msh *MobileServiceHandler) List(c echo.Context) error {
	services, err := msh.mobileServiceLister.List(msh.namespace)
	if err != nil {
		c.Logger().Errorf("error listing services %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, services)
}
