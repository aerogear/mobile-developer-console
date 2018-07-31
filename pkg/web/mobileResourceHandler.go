package web

import (
	"net/http"

	"github.com/aerogear/mobile-client-service/pkg/mobile"
	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// MobileResourceHandler handles queries for mobile client custom resources.
type MobileResourceHandler struct {
	lister mobile.MobileResourceLister
}

// NewMobileResourceHandler returns a MobileResourceHandler
func NewMobileResourceHandler(lister mobile.MobileResourceLister) *MobileResourceHandler {
	return &MobileResourceHandler{
		lister: lister,
	}
}

func (mrh *MobileResourceHandler) list(context echo.Context) error {
	mobileClientResourceList, err := mrh.lister.List()
	if err != nil {
		return err
	}

	return context.JSON(http.StatusOK, mobileClientResourceList)
}

func (mrh *MobileResourceHandler) watch(context echo.Context, resourceVersion string) error {
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
