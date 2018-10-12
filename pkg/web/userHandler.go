package web

import (
	"github.com/labstack/echo"
	"net/http"
)

const (
	USER_NAME_HEADER  = "X-Forwarded-User"
	USER_EMAIL_HEADER = "X-Forwarded-Email"
)

type UserHandler struct{}

func NewUserHandler() *UserHandler {
	return &UserHandler{}
}

func (handler *UserHandler) GetUserInfo(c echo.Context) error {
	user := &User{
		Name:  "Unknown",
		Email: "Unknown",
	}
	//these headers values will be set by the openshift oauth-proxy
	if userNameHeader := c.Request().Header[USER_NAME_HEADER]; userNameHeader != nil && userNameHeader[0] != "" {
		user.Name = userNameHeader[0]
	}
	if userEmailHeader := c.Request().Header[USER_EMAIL_HEADER]; userEmailHeader != nil && userEmailHeader[0] != "" {
		user.Email = userEmailHeader[0]
	}
	return c.JSON(http.StatusOK, user)
}
