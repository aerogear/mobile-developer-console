package config

import (
	"os"
	"reflect"
	"testing"
)

func TestConfig(t *testing.T) {
	expected := config{ListenAddress: ":4000", LogLevel: "info", LogFormat: "text", ApiRoutePrefix: "/api", OperatorResyncPeriod: 10}
	config := GetConfig()

	if !reflect.DeepEqual(expected, config) {
		t.Errorf("GetConfig() did not return expected result.\nexpected: %v\ngot: %v", expected, config)
	}
}

func TestConfigEnvironmentVariables(t *testing.T) {
	expected := config{ListenAddress: ":5000", LogLevel: "info", LogFormat: "text", ApiRoutePrefix: "/api", OperatorResyncPeriod: 20}

	os.Setenv("PORT", "5000")
	os.Setenv("RESYNC_PERIOD", "20")

	config := GetConfig()

	if !reflect.DeepEqual(expected, config) {
		t.Errorf("GetConfig() did not return expected result.\nexpected: %v\ngot: %v", expected, config)
	}
}
