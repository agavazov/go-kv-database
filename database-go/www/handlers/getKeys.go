package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"net/http"
)

func GetKeys(c echo.Context) error {
	keys := make([]string, 0, len(storage.GetAll()))
	for key := range storage.GetAll() {
		keys = append(keys, key)
	}

	return c.JSON(http.StatusOK, keys)
}
