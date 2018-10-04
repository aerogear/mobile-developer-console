package web

import (
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
	log "github.com/sirupsen/logrus"
	"k8s.io/apimachinery/pkg/watch"
)

var (
	writeWait  = 10 * time.Second
	pongWait   = 60 * time.Second
	pingPeriod = (pongWait * 9) / 10
	upgrader   = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func SetupWS(newWriteWait int, newPongWait int) {
	writeWait = time.Duration(newWriteWait) * time.Second
	pongWait = time.Duration(newPongWait) * time.Second
	pingPeriod = (pongWait * 9) / 10
}

func ServeWS(context echo.Context, watchInterface watch.Interface) error {
	ws, err := upgrader.Upgrade(context.Response(), context.Request(), nil)
	if err != nil {
		return err
	}

	go run(ws, watchInterface)
	return nil
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
				log.Warnf("WebSocket error (sending event): %v", err)
				return
			}
		case <-pingTicker.C:
			ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.WriteMessage(websocket.PingMessage, []byte{}); err != nil {
				log.Warnf("WebSocket error (sending ping): %v", err)
				return
			}
		}
	}
}
