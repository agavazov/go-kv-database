package app

import (
	"fmt"
)

func Logger(message any, level int) {
	if level <= ServiceLogLevel {
		return
	}

	fmt.Printf("%+v\n", message)
}
