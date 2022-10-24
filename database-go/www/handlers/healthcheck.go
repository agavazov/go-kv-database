package handlers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func Healthcheck(c echo.Context) error {
	// Response
	return c.JSON(http.StatusOK, map[string]string{
		"status": "ok",
	})
}
