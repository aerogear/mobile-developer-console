package web

import (
	"fmt"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func statusToString(status *errors.StatusError) string {
	switch reason := status.ErrStatus.Reason; reason {
	case metav1.StatusReasonAlreadyExists:
		return "Already Exists"
	case metav1.StatusReasonBadRequest:
		return "Bad Request"
	case metav1.StatusReasonInternalError:
		return "Internal Error"
	case metav1.StatusReasonMethodNotAllowed:
		return "Method Not Allowed"
	case metav1.StatusReasonNotAcceptable:
		return "Not Acceptable"
	case metav1.StatusReasonNotFound:
		return "Not Found"
	case metav1.StatusReasonServerTimeout:
		return "Server Timeout"
	case metav1.StatusReasonServiceUnavailable:
		return "Service Unavailable"
	case metav1.StatusReasonTooManyRequests:
		return "Too Many Requests"
	case metav1.StatusReasonUnknown:
		return "Unknown"
	case metav1.StatusReasonUnsupportedMediaType:
		return "Unsupported Media Type"
	default:
		return string(reason)
	}
}

// Tries to return the error code for the given error. If that is not possible, Error() is returned.
func getErrorMessage(e error) string {
	switch t := e.(type) {
	case *errors.StatusError:
		switch reason := errors.ReasonForError(e); reason {
		case metav1.StatusReasonAlreadyExists:
			return fmt.Sprintf("Item identified by '%s' already exists", t.ErrStatus.Details.Name)
		case metav1.StatusReasonNotFound:
			return fmt.Sprintf("Can't find item identified by '%s'", t.ErrStatus.Details.Name)
		default:
			return fmt.Sprintf("An error has occurred performing the requested operation: %s", statusToString(t))
		}
	default:
		return e.Error()
	}
}