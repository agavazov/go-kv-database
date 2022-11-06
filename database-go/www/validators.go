package www

import (
	"errors"
	"go-kv-database/app"
	"net/url"
)

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

	if length >= app.MaxKeyLength {
		return errors.New("MAXIMUM_KEY_LENGTH_REACHED")
	}

	return nil
}

func ValidateValue(params url.Values) error {
	values, exists := params["v"]

	if exists != true || len(values) <= 0 {
		return errors.New("MISSING_VALUE_PARAM")
	}

	value := values[0]
	length := len([]rune(value))

	if length >= app.MaxValueLength {
		return errors.New("MAXIMUM_VALUE_LENGTH_REACHED")
	}

	return nil
}

func ValidateMyUrl(params url.Values) error {
	values, exists := params["myUrl"]

	if exists != true || len(values) <= 4 {
		return errors.New("ENTER_VALID_URL")
	}

	return nil
}
