package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/storage"
	"net/http"
)

func Status(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]any{
		"version":          app.Version,
		"nodeId":           app.NodeId,
		"servicePort":      app.ServicePort,
		"serviceUrl":       app.ServiceUrl,
		"serviceLogLevel":  app.ServiceLogLevel,
		"isWarmup":         app.IsWarmup,
		"meshNetworkUrl":   app.MeshNetworkUrl,
		"meshNodes":        app.MeshNodes,
		"maxKeyLength":     app.MaxKeyLength,
		"maxValueLength":   app.MaxValueLength,
		"availableRecords": len(storage.GetAll()),
	})
}
