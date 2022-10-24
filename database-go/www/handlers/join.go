package handlers

import (
	"fmt"
	"github.com/labstack/echo/v4"
	"go-kv-database/app"
	"net/http"
	"net/url"
)

func Join(c echo.Context) error {
	// Request validation
	//if err := www.ValidateMyUrl(c.QueryParams()); err != nil {
	//  return www.InvalidInputResponse(c, err.Error())
	//}

	// Get url param
	newNodeUrl := c.QueryParam("myUrl")

	// Don't check for nodeId to be able to tell to the other nodes too
	// (because this may come from another node, and we don`t have to stop populate it)
	checkNodeId := false

	// Check is already added
	if indexOf(newNodeUrl, app.MeshNodes) != -1 {
		app.Logger(4, fmt.Sprintf("Skip to join [%s]", newNodeUrl))

		// Response
		return c.JSON(http.StatusOK, map[string]bool{
			"success": true,
			"isNew":   false,
		})
	}

	// Check is the same as me
	isNew := true
	if newNodeUrl == app.ServiceUrl {
		app.Logger(4, fmt.Sprintf("Skip to join myself to me [%s]", newNodeUrl))
		isNew = false
	}

	// Add the url to the mesh
	if isNew {
		app.MeshNodes = append(app.MeshNodes, newNodeUrl)
	}

	// Replicate
	app.AsyncReplicateMeshRequest(c.Path(), c.QueryParams(), checkNodeId)

	// Introduce myself to the others
	introduceParams := url.Values{
		"myUrl": []string{app.ServiceUrl},
	}
	app.AsyncReplicateMeshRequest(c.Path(), introduceParams, checkNodeId)

	// Response
	return c.JSON(http.StatusOK, map[string]bool{
		"success": true,
		"isNew":   isNew,
	})
}

func indexOf(element string, data []string) int {
	for k, v := range data {
		if element == v {
			return k
		}
	}
	return -1
}
