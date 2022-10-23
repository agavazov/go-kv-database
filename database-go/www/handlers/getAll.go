package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"net/http"
)

func GetAll(c echo.Context) error {
	records := make([]map[string]string, 0, len(storage.GetAll()))
	for key, value := range storage.GetAll() {
		records = append(records, map[string]string{
			"k": key,
			"v": value,
		})
	}

	return c.JSON(http.StatusOK, records)
}
