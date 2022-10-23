package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"net/http"
)

func GetValues(c echo.Context) error {
	values := make([]string, 0, len(storage.GetAll()))
	for _, value := range storage.GetAll() {
		values = append(values, value)
	}

	return c.JSON(http.StatusOK, values)
}
