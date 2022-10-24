package main

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"go-kv-database/www/handlers"
)

func main() {
	// Load env settings
	app.LoadSettings()

	// Start mesh checks & join process parallel with the http server starting
	app.AsyncMeshJoin()

	// Echo instance
	e := echo.New()
	e.HideBanner = true

	// Set record ?k=KEY&v=VALUE [mutable]
	e.GET("/set", handlers.Set)

	// Get record ?k=KEY&v=VALUE [immutable]
	e.GET("/get", handlers.Get)

	// Remove record ?k=KEY [mutable]
	e.GET("/rm", handlers.Rm)

	// Clear all records ? [mutable]
	e.GET("/clear", handlers.Clear)

	// Is exists ?k=KEY [immutable]
	e.GET("/is", handlers.Is)

	// Get all keys [immutable]
	e.GET("/getKeys", handlers.GetKeys)

	// Get all values [immutable]
	e.GET("/getValues", handlers.GetValues)

	// Get all records [immutable]
	e.GET("/getAll", handlers.GetAll)

	// Get server heath status (warmup or health) [immutable]
	e.GET("/healthcheck", handlers.Healthcheck)

	// Get server settings [immutable]
	e.GET("/status", handlers.Status)

	// Join node to this one and make mesh [mutable]
	e.GET("/join", handlers.Join)

	// Start server
	app.Logger(1, fmt.Sprintf("GO Running on %s [NodeId: %s]", app.ServiceUrl, app.NodeId))
	e.Logger.Fatal(e.Start(fmt.Sprintf(":%d", app.ServicePort)))
}
