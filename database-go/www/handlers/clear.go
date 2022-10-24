package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"net/http"
)

func Clear(c echo.Context) error {
	storage.Clear()

	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})
}
