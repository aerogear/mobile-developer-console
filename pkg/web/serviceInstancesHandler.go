package web

import (
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
)

type MobileServiceInstancesHandler struct {
	namespace             string
	serviceInstanceLister mobile.ServiceInstanceLister
}

func NewMobileServiceInstancesHandler(serviceInstanceLister mobile.ServiceInstanceLister, namespace string) *MobileServiceInstancesHandler {
	return &MobileServiceInstancesHandler{
		serviceInstanceLister: serviceInstanceLister,
		namespace:             namespace,
	}
}

func (msih *MobileServiceInstancesHandler) List(c echo.Context) error {
	si, err := msih.serviceInstanceLister.List()
	if err != nil {
		c.Logger().Errorf("error listing service instances: %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, si)
}

func (msih *MobileServiceInstancesHandler) Watch(c echo.Context) error {
	getWatchInterface := msih.serviceInstanceLister.Watch()

	err := ServeWS(c, getWatchInterface)
	if err != nil {
		c.Logger().Errorf("error watching service instances: %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return nil
}
