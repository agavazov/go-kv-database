package main

import (
	"github.com/labstack/echo/v4"
	"net/http"
)

func main() {
	// Echo instance
	e := echo.New()

	// Routes
	e.GET("/", testHandler)
	e.GET("/healthcheck", testHandler)

	// Start server
	e.Logger.Fatal(e.Start(":80"))
}

type TestServer struct {
	Status  string `json:"status" xml:"status"`
	Version string `json:"version" xml:"version"`
}

func testHandler(c echo.Context) error {
	u := &TestServer{
		Status:  "OK",
		Version: "0.0.1",
	}
	return c.JSON(http.StatusOK, u)
}
