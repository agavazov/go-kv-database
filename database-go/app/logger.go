package app

import (
	"fmt"
)

func Logger(level int, msg ...any) {
	if level <= ServiceLogLevel {
		return
	}

	fmt.Printf(">>> %+v\n", msg)
}
