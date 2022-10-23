package handlers

import (
	"github.com/labstack/echo/v4"
	"go-kv-database/storage"
	"go-kv-database/www"
	"net/http"
)

func Get(c echo.Context) error {
	if err := www.ValidateKey(c.QueryParams()); err != nil {
		return www.InvalidInputResponse(c, err.Error())
	}

	key := c.QueryParam("k")
	value, found := storage.Get(key)

	if found != true {
		return www.NotFoundResponse(c, "MISSING_RECORD")
	}

	return c.JSON(http.StatusOK, value)
}
