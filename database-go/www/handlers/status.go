package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/settings"
	"net/http"
)

func Status(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]any{
		"version":          "0.0.1",
		"nodeId":           "this.settings.nodeId",
		"servicePort":      "this.settings.servicePort",
		"serviceUrl":       "this.settings.serviceUrl",
		"serviceLogLevel":  "this.settings.serviceLogLevel",
		"isWarmup":         false,
		"meshNetworkUrl":   "this.settings.meshNetworkUrl",
		"meshNodes":        "this.settings.meshNodes",
		"maxKeyLength":     settings.MaxKeyLength,
		"maxValueLength":   settings.MaxValueLength,
		"availableRecords": "Object.keys(this.db).length",
	})
}
