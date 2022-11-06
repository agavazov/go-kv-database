package app

import (
	"encoding/json"
	"fmt"
	"go-kv-database/storage"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"
)

type ReqParam map[string]string

func AsyncMeshJoin() {
	go func() {
		// Check is there mesh network url to join
		Logger(1, "MeshNetworkUrl", MeshNetworkUrl)
		if MeshNetworkUrl != "" {
			// Introduce myself to another node
			JoinToNode(MeshNetworkUrl)

			// Start mesh network observer
			MeshCheckWorker()
		} else {
			// If there is no network to join then the app will be marked as ready to get connections
			JoinComplete()
		}
	}()
}

func JoinComplete() {
	// If there is no network to join then the app will be marked as warmed up
	IsWarmup = true

	// Run the waiting queue if something was blocking the service (like the warmup process)
	RunWaitingQueue()

	// Log
	Logger(4, "JoinComplete.totalRecords", len(storage.GetAll()))
}

func AsyncReplicateMeshRequest(path string, params url.Values, checkNodeId bool) {
	go func() {
		ReplicateMeshRequest(path, params, checkNodeId)
	}()
}

func ReplicateMeshRequest(path string, params url.Values, checkNodeId bool) {
	// Prepare query the params
	var reqParams = ReqParam{}
	for key, values := range params {
		if len(values) > 0 {
			reqParams[key] = values[0]
		} else {
			reqParams[key] = ""
		}
	}

	// Skip when comes from another node
	if checkNodeId {
		if nodeId, ok := reqParams["nodeId"]; ok {
			Logger(4, fmt.Sprintf("Request replication skipped: comes from another node [%s]", nodeId))
			return
		}
	}

	// Send the request to all nodes
	for _, nodeUrl := range MeshNodes {
		_, respCode, err := RequestNode[any](fmt.Sprintf("%s%s", nodeUrl, path),
			reqParams,
			0,
			0,
		)

		// Lof the error when the other instance is not warming up
		if err != nil && respCode == 503 {
			Logger(4, "MeshRequest error", err)
		}
	}
}

func RequestNode[T any](nodeUrl string,
	params ReqParam,
	retires int,
	waitPerRequest time.Duration,
) (T, int, error) {
	// Defaults
	if retires == 0 {
		retires = 1
	}

	if waitPerRequest == 0 {
		waitPerRequest = 500 * time.Millisecond
	}

	// Build query
	values := url.Values{}
	for key, value := range params {
		values.Add(key, value)
	}
	query := values.Encode()

	// Make the http request
	var result T
	var statusCode int

	resp, err := http.Get(fmt.Sprintf("%s?%s", nodeUrl, query))

	// If the request fails
	if err != nil {
		return result, statusCode, err
	}

	// Close the body and read it (io.ReadCloser)
	defer resp.Body.Close()

	// Get response body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return result, statusCode, err
	}
	bodyString := string(bodyBytes)

	// Parse to JSON
	err = json.Unmarshal([]byte(bodyString), &result)
	if err != nil {
		return result, statusCode, err
	}

	// Return the json object
	return result, resp.StatusCode, nil
}

func JoinToNode(nodeUrl string) {
	// Get other node info
	srvInfo, respCode, err := RequestNode[ServiceStatus](fmt.Sprintf("%s/status", nodeUrl),
		ReqParam{},
		10,
		1000,
	)

	// If the other node is not accessible then current service must be stopped
	if err != nil {
		Logger(4, "JoinToNode.srvInfo.err", err)
		Logger(4, "JoinToNode.srvInfo.msg", fmt.Sprintf("%s is not accessable!\nBye Bye!", nodeUrl))
		os.Exit(1)
	}

	// Ask to join in the mesh
	_, respCode, err = RequestNode[any](fmt.Sprintf("%s/join", nodeUrl),
		ReqParam{"myUrl": ServiceUrl},
		10,
		100,
	)

	// If there is no errors or the requested node is warming up then we can add it to the list
	if err == nil || respCode == 503 {
		// Push the url to the current service list
		MeshNodes = append(MeshNodes, MeshNetworkUrl)
	} else {
		Logger(4, "JoinToNode.join.err", err)
	}

	// Get other node data - Move on when there is no data
	if srvInfo.AvailableRecords <= 0 {
		Logger(1, fmt.Sprintf("The node [%s] does not have data. Join complete", MeshNetworkUrl), err)
		JoinComplete()
		return
	}

	// Get the data
	nodeStorage, respCode, err := RequestNode[[]KV](fmt.Sprintf("%s/getAll", nodeUrl),
		ReqParam{},
		0,
		0,
	)
	if err == nil && len(nodeStorage) > 0 {
		for _, record := range nodeStorage {
			storage.Set(record.Value, record.Key)
		}
	}

	// Complete the process
	JoinComplete()
}

// MeshCheckWorker Sync & check the mesh network
// Mostly used to disconnect the dead nodes
// (check each node and remove it when is down or join after warmup)
func MeshCheckWorker() {
	ticker := time.NewTicker(100 * time.Millisecond)
	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				// @todo - check for dead nodes
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}
