package mobile

import (
	"k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
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

func (crudl *SecretsCRUDLImpl) List(namespace string) (*v1.SecretList, error) {
	listOpts := metav1.ListOptions{}
	return crudl.secretsClient.Secrets(namespace).List(listOpts)
}

func (crudl *SecretsCRUDLImpl) Watch(namespace string) func() (watch.Interface, error) {
	return func() (watch.Interface, error) {
		watchOpts := metav1.ListOptions{
			LabelSelector: "mobile",
		}
		return crudl.secretsClient.Secrets(namespace).Watch(watchOpts)
	}
}
