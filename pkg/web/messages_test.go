package web

import (
	"github.com/pkg/errors"
	errors2 "k8s.io/apimachinery/pkg/api/errors"
	"testing"
)

func TestGetErrorMessage_std(t *testing.T) {
	err := errors.New("Test error")
	msg := getErrorMessage(err)
	if msg != err.Error() {
		t.Fatalf("Received '%s' while expecting '%s'", msg, err.Error())
	}
}

func TestGetErrorMessage_StatusError(t *testing.T) {
	const expect = "An error has occurred performing the requested operation: Bad Request"
	err := errors2.NewBadRequest("Test error")
	msg := getErrorMessage(err)
	if msg != expect {
		t.Fatalf("Received '%s' while expecting '%s'", msg, err.Error())
	}
}
