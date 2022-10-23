package handlers

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func Join(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{
		"service": "join.go",
	})
}
