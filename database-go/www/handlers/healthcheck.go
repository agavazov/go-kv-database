package handlers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func Healthcheck(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"service": "healthcheck.go",
	})
}
