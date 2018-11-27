package mobile

import (
	"fmt"
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
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

func (crudl *SecretsCRUDLImpl) DeleteAppData(mobileClient *v1alpha1.MobileClient) error {
	client := crudl.secretsClient.Secrets(mobileClient.GetNamespace())

	listOpts := metav1.ListOptions{
		LabelSelector: fmt.Sprintf("%s=%s", BUILD_CONFIG_LABEL_NAME, mobileClient.GetName()),
	}
	list, err := client.List(listOpts)
	if err != nil {
		return err
	}

	for _, bc := range list.Items {
		err := client.Delete(bc.GetName(), &metav1.DeleteOptions{})
		if err != nil {
			return err
		}
	}

	return nil
}
