package config

import (
	"os"
	"reflect"
	"testing"
)

func TestConfig(t *testing.T) {
	expected := Config{ListenAddress: ":4000", LogLevel: "info", LogFormat: "text", ApiRoutePrefix: "/api", WsWriteWait: 10, WsPongWait: 60, BuildTabEnabled: false, DocsPrefix: "https://docs.aerogear.org/aerogear/latest"}
	config := GetConfig()

	if !reflect.DeepEqual(expected, config) {
		t.Errorf("GetConfig() did not return expected result.\nexpected: %v\ngot: %v", expected, config)
	}
}

func TestConfigEnvironmentVariables(t *testing.T) {
	expected := Config{ListenAddress: ":5000", LogLevel: "info", LogFormat: "text", ApiRoutePrefix: "/api", WsWriteWait: 10, WsPongWait: 60, BuildTabEnabled: true, DocsPrefix: "1.1"}

	os.Setenv("PORT", "5000")
	os.Setenv("RESYNC_PERIOD", "20")
	os.Setenv("ENABLE_BUILD_TAB", "true")
	os.Setenv("DOCS_PREFIX", "1.1")

	config := GetConfig()

	if !reflect.DeepEqual(expected, config) {
		t.Errorf("GetConfig() did not return expected result.\nexpected: %v\ngot: %v", expected, config)
	}
}
