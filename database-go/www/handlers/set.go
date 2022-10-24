package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/storage"
	"go-kv-database/www"
	"net/http"
)

func Set(c echo.Context) error {
	// Request validation
	if err := www.ValidateKey(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	if err := www.ValidateValue(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	key := c.QueryParam("k")
	value := c.QueryParam("v")

	// Database actions
	storage.Set(key, value)

	// Request replicate to the other nodes
	app.AsyncReplicateMeshRequest(c.Path(), c.QueryParams(), true)

	// Response
	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})
}
