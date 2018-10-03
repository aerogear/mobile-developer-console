package web

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	"k8s.io/apimachinery/pkg/watch"
)

const (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func ServeWS(context echo.Context, watchInterface watch.Interface) {
	ws, err := upgrader.Upgrade(context.Response(), context.Request(), nil)
	if err != nil {
		return
	}

	go run(ws, watchInterface)
}

func run(ws *websocket.Conn, watchInterface watch.Interface) {
	pingTicker := time.NewTicker(pingPeriod)
	events := watchInterface.ResultChan()
	defer func() {
		watchInterface.Stop()
		pingTicker.Stop()
		ws.Close()
	}()
	for {
		select {
		case <-events:
			ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.WriteMessage(websocket.TextMessage, []byte("event")); err != nil {
				return
			}
		case <-pingTicker.C:
			ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}
