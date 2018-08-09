package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type config struct {
	ListenAddress        string //will look like ":4000"
	LogLevel             string
	LogFormat            string
	StaticFilesDir       string
	ApiRoutePrefix       string
	OperatorResyncPeriod int
}

func GetConfig() config {

	return config{
		ListenAddress:        fmt.Sprintf(":%v", getEnv("PORT", "4000")),
		LogLevel:             strings.ToLower(getEnv("LOG_LEVEL", "info")),
		LogFormat:            strings.ToLower(getEnv("LOG_FORMAT", "text")), //cann be text or json
		StaticFilesDir:       getEnv("STATIC_FILES_DIR", ""),
		ApiRoutePrefix:       "/api", //should start with a "/",
		OperatorResyncPeriod: getEnvAsInt("RESYNC_PERIOD", 10),
	}
}

func getEnv(key string, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvAsInt(key string, defaultVal int) int {
	i := defaultVal
	if s := getEnv(key, ""); s != "" {
		v, err := strconv.Atoi(s)
		if err == nil {
			i = v
		}
	}
	return i
}
