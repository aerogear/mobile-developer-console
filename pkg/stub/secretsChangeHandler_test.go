package stub

import (
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"testing"
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"

	k8v1 "k8s.io/api/core/v1"
)


type mockWatchInterface struct{}

func (m *mockWatchInterface) Stop() {}

func (m *mockWatchInterface) ResultChan() <-chan watch.Event {
	ch := make(chan watch.Event)
	go func() {
		ch <- watch.Event{
			Object: nil,
			Type:   "event",
		}
	}()
	return ch
}

type mockSecretsCRUDL struct {
	secrets []k8v1.Secret
}

func NewMockSecretsCRUDL(secrets []k8v1.Secret) *mockSecretsCRUDL {
	return &mockSecretsCRUDL{
		secrets: secrets,
	}
}

func (m *mockSecretsCRUDL) List(namespace string) (*k8v1.SecretList, error) {
	return &k8v1.SecretList{
		Items: m.secrets,
	}, nil
}

func (m *mockSecretsCRUDL) Create(namespace string, secret *k8v1.Secret) (*k8v1.Secret, error) {
	return nil, nil
}

func (m *mockSecretsCRUDL) Watch(namespace string) func() (watch.Interface, error) {
	return func() (watch.Interface, error) {
		return &mockWatchInterface{}, nil
	}
}

func createSecret(id string, clientId string) k8v1.Secret {
	labels := make(map[string]string)
	labels["mobile"] = "enabled"
	labels["clientId"] = clientId
	data := make(map[string][]byte)
	data["id"] = []byte(id)
	return k8v1.Secret{
		TypeMeta: metav1.TypeMeta{},
		ObjectMeta: metav1.ObjectMeta{
			Labels:          labels,
			ResourceVersion: "1",
		},
		Data: data,
	}
}

func TestHandler(t *testing.T) {
	cases := []struct {
		Name    string
		Secrets []k8v1.Secret
	}{
		{
			Name: "test one binding",
			Secrets: []k8v1.Secret{
				createSecret("test-service", "test-app"),
			},
		},
		{
			Name:    "test no bindings",
			Secrets: []k8v1.Secret{},
		},
	}

	mockApps := mobile.NewMockMobileClientRepo()
	client := &v1alpha1.MobileClient{
		ObjectMeta: metav1.ObjectMeta{
			Name: "test-app",
		},
		Spec: v1alpha1.MobileClientSpec{
			Name: "test-app",
		},
		Status: v1alpha1.MobileClientStatus{},
	}
	mockApps.Create(client)

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			mockSecrets := NewMockSecretsCRUDL(tc.Secrets)
			HandleSecretsChange("test-namespace", mockApps, mockSecrets)
			app, _ := mockApps.ReadByName("test-app")
			if len(app.Status.Services) != len(tc.Secrets) {
				t.Fatalf("mobile client validation failed")
			}
		})
	}
}
