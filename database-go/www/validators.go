package www

import (
	"errors"
	"go-kv-database/settings"
	"net/url"
)

// ParamExists @todo
func ParamExists(param string, errorText string) error {
	return errors.New(errorText)

	return nil
}

// ValidateKey @todo
func ValidateKey(params url.Values) error {
	values, exists := params["k"]

	if exists != true || len(values) <= 0 {
		return errors.New("MISSING_KEY_PARAM")
	}

	value := values[0]
	length := len([]rune(value))

	if length <= 0 {
		return errors.New("EMPTY_KEY")
	}

	if length >= settings.MaxKeyLength {
		return errors.New("MAXIMUM_KEY_LENGTH_REACHED")
	}

	return nil
}

// ValidateValue @todo
func ValidateValue(params url.Values) error {
	values, exists := params["v"]

	if exists != true || len(values) <= 0 {
		return errors.New("MISSING_VALUE_PARAM")
	}

	value := values[0]
	length := len([]rune(value))

	if length >= settings.MaxValueLength {
		return errors.New("MAXIMUM_VALUE_LENGTH_REACHED")
	}

	return nil
}
