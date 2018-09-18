package mobile

import (
	"k8s.io/api/core/v1"
	kubev1 "k8s.io/client-go/kubernetes/typed/core/v1"
)

type SecretsCRUDLImpl struct {
	secretsClient kubev1.CoreV1Interface
}

func NewSecretsCRUDL(client kubev1.CoreV1Interface) *SecretsCRUDLImpl {
	return &SecretsCRUDLImpl{
		secretsClient: client,
	}
}

func (crudl *SecretsCRUDLImpl) Create(namespace string, secret *v1.Secret) (*v1.Secret, error) {
	return crudl.secretsClient.Secrets(namespace).Create(secret)
}
