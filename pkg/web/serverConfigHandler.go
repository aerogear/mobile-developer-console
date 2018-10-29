package web

import (
	"bytes"
	"fmt"
	"net/http"
	"text/template"

	"github.com/aerogear/mobile-developer-console/pkg/config"
	"github.com/labstack/echo"
)

type ServerConfigHandler struct {
	config   config.Config
	template *template.Template
}

const tmpl = `
window.SERVER_DATA='{"ENABLE_BUILD_TAB":{{.BuildTabEnabled}}}';
`

func NewServerConfigHandler(config config.Config) *ServerConfigHandler {
	t, err := template.New("server_data").Parse(tmpl)
	if err != nil {
		panic(fmt.Sprintf("can not parse template file: %v", err))
	}
	return &ServerConfigHandler{
		config:   config,
		template: t,
	}
}

func (handler *ServerConfigHandler) Handle(c echo.Context) error {
	var writer bytes.Buffer

	err := handler.template.Execute(&writer, handler.config)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.Blob(http.StatusOK, echo.MIMEApplicationJavaScript, (&writer).Bytes())
}
