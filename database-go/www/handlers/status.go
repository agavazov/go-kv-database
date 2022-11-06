package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/storage"
	"net/http"
)

func Status(c echo.Context) error {
	// Response
	return c.JSON(http.StatusOK, app.ServiceStatus{
		Version:          app.Version,
		NodeId:           app.NodeId,
		ServicePort:      app.ServicePort,
		ServiceUrl:       app.ServiceUrl,
		ServiceLogLevel:  app.ServiceLogLevel,
		IsWarmup:         app.IsWarmup,
		MeshNetworkUrl:   app.MeshNetworkUrl,
		MeshNodes:        app.MeshNodes,
		MaxKeyLength:     app.MaxKeyLength,
		MaxValueLength:   app.MaxValueLength,
		AvailableRecords: len(storage.GetAll()),
	})
}
