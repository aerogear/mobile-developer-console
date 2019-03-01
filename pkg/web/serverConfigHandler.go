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
window.SERVER_DATA='{"ENABLE_BUILD_TAB":{{.BuildTabEnabled}},"DOCS_PREFIX":"{{.DocsPrefix}}"}';
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
		c.Logger().Errorf("error server config: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.Blob(http.StatusOK, echo.MIMEApplicationJavaScript, (&writer).Bytes())
}
