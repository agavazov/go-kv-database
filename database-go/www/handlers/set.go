package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"go-kv-database/www"
	"net/http"
)

func Set(c echo.Context) error {
	if err := www.ValidateKey(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	if err := www.ValidateValue(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	key := c.QueryParam("k")
	value := c.QueryParam("v")

	storage.Set(key, value)

	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
	})
}
