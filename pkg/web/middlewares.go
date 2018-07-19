package web

import (
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"
)

func loggerMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		next.ServeHTTP(w, r)

		log.WithFields(log.Fields{
			"method":        r.Method,
			"path":          r.RequestURI,
			"client_ip":     r.RemoteAddr,
			"response_time": time.Since(start),
		}).Info()
	})
}
