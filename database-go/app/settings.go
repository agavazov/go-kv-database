package app

import (
	"fmt"
	"github.com/joho/godotenv"
	"os"
	"strconv"
)

const (
	Version        = "0.0.1"
	MaxKeyLength   = 64
	MaxValueLength = 128
)

var (
	// NodeId Must be unique per node (usually is provided by Dcoker or K8S)
	NodeId = ""

	// ServicePort Current node HTTP port to run
	ServicePort = 80

	// ServiceUrl Current node URL external URL (access it from outside)
	ServiceUrl = ""

	// ServiceLogLevel Each level covers the previous one
	// 0 - NOTHING
	// 1 - SYSTEM_MESSAGES
	// 2 - MESH_STATUS
	// 3 - MESH_ACTIONS
	// 4 - INCOME_REQUESTS
	// Soon there will be a map
	ServiceLogLevel = 0

	// IsWarmup do the node gets all the data from the other nodes in the mesh
	IsWarmup = true

	// MeshNetworkUrl url to one of the nodes in the mesh network
	MeshNetworkUrl = ""

	// MeshNodes list of connected nodes
	MeshNodes []string
)

func LoadSettings() {
	err := godotenv.Load()
	if err != nil {
		Logger(1, "Error loading .env file")
	}

	NodeId = "DB_" + os.Getenv("HOSTNAME")
	ServicePort, _ = strconv.Atoi(os.Getenv("SERVICE_PORT"))
	ServiceUrl = os.Getenv("SERVICE_URL")
	ServiceLogLevel, _ = strconv.Atoi(os.Getenv("SERVICE_URL"))
	MeshNetworkUrl = os.Getenv("MESH_NETWORK_URL")

	if ServiceUrl == "" {
		ServiceUrl = fmt.Sprintf("%s:%d", os.Getenv("HOSTNAME"), ServicePort)
	}
}
