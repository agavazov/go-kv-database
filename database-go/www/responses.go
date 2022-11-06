package www

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func InvalidInputResponse(c echo.Context, error string) error {
	return c.JSON(http.StatusBadRequest, map[string]string{
		"error": error,
	})
}

func NotFoundResponse(c echo.Context, error string) error {
	return c.JSON(http.StatusNotFound, map[string]string{
		"error": error,
	})
}
