package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Config struct {
	ListenAddress        string //will look like ":4000"
	LogLevel             string
	LogFormat            string
	StaticFilesDir       string
	ApiRoutePrefix       string
	OperatorResyncPeriod int
	WsWriteWait          int
	WsPongWait           int
	BuildTabEnabled      bool
}

func GetConfig() Config {

	return Config{
		ListenAddress:        fmt.Sprintf(":%v", getEnv("PORT", "4000")),
		LogLevel:             strings.ToLower(getEnv("LOG_LEVEL", "info")),
		LogFormat:            strings.ToLower(getEnv("LOG_FORMAT", "text")), //cann be text or json
		StaticFilesDir:       getEnv("STATIC_FILES_DIR", ""),
		ApiRoutePrefix:       "/api", //should start with a "/",
		OperatorResyncPeriod: getEnvAsInt("RESYNC_PERIOD", 10),
		WsWriteWait:          getEnvAsInt("WS_WRITE_WAIT", 10),
		WsPongWait:           getEnvAsInt("WS_PONG_WAIT", 60),
		BuildTabEnabled:      getEnvAsBool("ENABLE_BUILD_TAB", false),
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

func getEnvAsBool(key string, defaultVal bool) bool {
	b := defaultVal
	if s := getEnv(key, ""); s != "" {
		v, err := strconv.ParseBool(s)
		if err == nil {
			b = v
		}
	}
	return b
}
