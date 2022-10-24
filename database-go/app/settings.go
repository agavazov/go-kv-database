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
	NodeId          = ""
	ServicePort     = 80
	ServiceUrl      = ""
	ServiceLogLevel = 0
	IsWarmup        = true
	MeshNetworkUrl  = ""
	MeshNodes       []string
)

func LoadSettings() {
	err := godotenv.Load()
	if err != nil {
		Logger("Error loading .env file", 1)
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
