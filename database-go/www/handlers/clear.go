package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/storage"
	"net/http"
)

func Clear(c echo.Context) error {
	// Database actions
	storage.Clear()

	// Request replicate to the other nodes
	app.AsyncReplicateMeshRequest(c.Path(), c.QueryParams(), true)

	// Response
	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})
}
