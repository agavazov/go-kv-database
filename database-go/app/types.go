package app

type ServiceStatus struct {
	Version          string   `json:"version"`
	NodeId           string   `json:"nodeId"`
	ServicePort      int      `json:"servicePort"`
	ServiceUrl       string   `json:"serviceUrl"`
	ServiceLogLevel  int      `json:"serviceLogLevel"`
	IsWarmup         bool     `json:"isWarmup"`
	MeshNetworkUrl   string   `json:"meshNetworkUrl"`
	MeshNodes        []string `json:"meshNodes"`
	MaxKeyLength     int      `json:"maxKeyLength"`
	MaxValueLength   int      `json:"maxValueLength"`
	AvailableRecords int      `json:"availableRecords"`
}

type KV struct {
	Key   string `json:"k"`
	Value string `json:"v"`
}
