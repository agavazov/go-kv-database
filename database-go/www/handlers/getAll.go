package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/storage"
	"net/http"
)

func GetAll(c echo.Context) error {
	// Database actions
	records := make([]app.KV, 0, len(storage.GetAll()))
	for key, value := range storage.GetAll() {
		records = append(records, app.KV{
			Key:   key,
			Value: value,
		})
	}

	// Response
	return c.JSON(http.StatusOK, records)
}
