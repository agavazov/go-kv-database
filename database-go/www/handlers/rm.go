package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/storage"
	"go-kv-database/www"
	"net/http"
)

func Rm(c echo.Context) error {
	// Request validation
	if err := www.ValidateKey(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	key := c.QueryParam("k")

	if _, found := storage.Get(key); found != true {
		return www.NotFoundResponse(c, "MISSING_RECORD")
	}

	// Database actions
	storage.Remove(key)

	// Request replicate to the other nodes
	app.AsyncReplicateMeshRequest(c.Path(), c.QueryParams(), true)

	// Response
	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})
}
