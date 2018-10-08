package web

import (
	"net/http"
	"os"
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
	}
)

func SetupWS(newWriteWait int, newPongWait int) {
	if os.Getenv("DEBUG") == "true" {
		upgrader.CheckOrigin = func(r *http.Request) bool {
			return true
		}
	}
	writeWait = time.Duration(newWriteWait) * time.Second
	pongWait = time.Duration(newPongWait) * time.Second
	pingPeriod = (pongWait * 9) / 10
}

func ServeWS(context echo.Context, getWatchInterface func() (watch.Interface, error)) error {
	ws, err := upgrader.Upgrade(context.Response(), context.Request(), nil)
	if err != nil {
		return err
	}

	go run(ws, getWatchInterface)
	return nil
}

func run(ws *websocket.Conn, getWatchInterface func() (watch.Interface, error)) {
	defer func() {
		ws.Close()
	}()
	watchInterface, err := getWatchInterface()
	if err != nil {
		return
	}
	pingTicker := time.NewTicker(pingPeriod)
	events := watchInterface.ResultChan()
	defer func() {
		if watchInterface != nil {
			watchInterface.Stop()
		}
		pingTicker.Stop()
	}()
	for {
		select {
		case event, ok := <-events:
			if !ok {
				watchInterface.Stop()
				watchInterface, err = getWatchInterface()
				if err != nil {
					return
				}
				events = watchInterface.ResultChan()
				continue
			}
			ws.SetWriteDeadline(time.Now().Add(writeWait))
			if err := ws.WriteMessage(websocket.TextMessage, []byte(event.Type)); err != nil {
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
