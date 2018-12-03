package web

import (
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
	"net/http"
)

type DeleteMobileClientHandler struct {
	mobileClientRepo mobile.MobileClientRepo
	appDeleter       mobile.AppDeleter
}

func NewDeleteMobileClientHander(mobileClientRepo mobile.MobileClientRepo, appDeleter mobile.AppDeleter) *DeleteMobileClientHandler {
	return &DeleteMobileClientHandler{
		mobileClientRepo: mobileClientRepo,
		appDeleter:       appDeleter,
	}
}

func (h *DeleteMobileClientHandler) Delete(c echo.Context) error {
	name := c.Param("name")
	mobileClient, err := h.mobileClientRepo.ReadByName(name)
	if err != nil {
		c.Logger().Errorf("can not read app with name %s due to error %v", name, err)
		return c.String(http.StatusBadRequest, getErrorMessage(err))
	}

	err = h.appDeleter.Delete(mobileClient)
	if err != nil {
		c.Logger().Errorf("error deleting mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.NoContent(http.StatusOK)
}
