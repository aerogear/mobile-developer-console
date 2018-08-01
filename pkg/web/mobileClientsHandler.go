package web

import (
	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/labstack/echo"
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

func (h *MobileClientsHandler) Create(c echo.Context) error {
	panic("implement me")
}

func (h *MobileClientsHandler) Read(c echo.Context) error {
	panic("implement me")
}

func (h *MobileClientsHandler) List(c echo.Context) error {
	panic("implement me")
}

func (h *MobileClientsHandler) Update(c echo.Context) error {
	panic("implement me")
}

func (h *MobileClientsHandler) Delete(c echo.Context) error {
	panic("implement me")
}