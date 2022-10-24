package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"go-kv-database/www"
	"net/http"
)

func Is(c echo.Context) error {
	// Request validation
	if err := www.ValidateKey(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	// Database actions & missing record check
	key := c.QueryParam("k")
	if _, found := storage.Get(key); found != true {
		return www.NotFoundResponse(c, "MISSING_RECORD")
	}

	// Response
	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})
}
