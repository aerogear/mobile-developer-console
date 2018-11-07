package stub

import (
	"testing"

	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	errors2 "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"

	k8v1 "k8s.io/api/core/v1"
)

type mockMobileClientRepo struct {
	mockStore map[string]*v1alpha1.MobileClient
}

func NewMockMobileClientRepo() *mockMobileClientRepo {
	repo := &mockMobileClientRepo{}
	repo.mockStore = make(map[string]*v1alpha1.MobileClient)
	return repo
}

func (r *mockMobileClientRepo) Create(app *v1alpha1.MobileClient) error {
	name := app.Name
	r.mockStore[name] = app
	return nil
}

func (r *mockMobileClientRepo) ReadByName(name string) (*v1alpha1.MobileClient, error) {
	app := r.mockStore[name]
	if app != nil {
		return app, nil
	}
	return nil, &errors2.StatusError{ErrStatus: v1.Status{
		Reason: v1.StatusReasonNotFound,
	}}
}

func (r *mockMobileClientRepo) Update(app *v1alpha1.MobileClient) error {
	name := app.Name
	if r.mockStore[name] != nil {
		r.mockStore[name] = app
		return nil
	}
	return &errors2.StatusError{ErrStatus: v1.Status{
		Reason: v1.StatusReasonNotFound,
	}}
}

func (r *mockMobileClientRepo) List() (*v1alpha1.MobileClientList, error) {
	items := make([]v1alpha1.MobileClient, 0)
	for _, app := range r.mockStore {
		items = append(items, *app)
	}
	return &v1alpha1.MobileClientList{
		Items: items,
	}, nil
}

func (r *mockMobileClientRepo) DeleteByName(name string) error {
	delete(r.mockStore, name)
	return nil
}

func (r *mockMobileClientRepo) Watch() func() (watch.Interface, error) {
	return nil
}

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

type mockSecretsCRUDL struct{}

func NewMockSecretsCRUDL() *mockSecretsCRUDL {
	return &mockSecretsCRUDL{}
}

func (m *mockSecretsCRUDL) List(namespace string) (*k8v1.SecretList, error) {
	labels := make(map[string]string)
	labels["mobile"] = "enabled"
	labels["clientId"] = "test-app"
	data := make(map[string][]byte)
	data["id"] = []byte("test-service")
	return &k8v1.SecretList{
		Items: []k8v1.Secret{
			k8v1.Secret{
				TypeMeta: metav1.TypeMeta{},
				ObjectMeta: metav1.ObjectMeta{
					Labels:          labels,
					ResourceVersion: "1",
				},
				Data: data,
			},
		},
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

type mockSecretsCRUDL2 struct{}

func NewMockSecretsCRUDL2() *mockSecretsCRUDL2 {
	return &mockSecretsCRUDL2{}
}

func (m *mockSecretsCRUDL2) List(namespace string) (*k8v1.SecretList, error) {
	labels := make(map[string]string)
	labels["mobile"] = "enabled"
	labels["clientId"] = "test-app"
	data := make(map[string][]byte)
	data["id"] = []byte("test-service")
	return &k8v1.SecretList{
		Items: []k8v1.Secret{},
	}, nil
}

func (m *mockSecretsCRUDL2) Create(namespace string, secret *k8v1.Secret) (*k8v1.Secret, error) {
	return nil, nil
}

func (m *mockSecretsCRUDL2) Watch(namespace string) func() (watch.Interface, error) {
	return func() (watch.Interface, error) {
		return &mockWatchInterface{}, nil
	}
}

func TestHandler(t *testing.T) {
	mockSecrets := NewMockSecretsCRUDL()
	mockApps := NewMockMobileClientRepo()
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
	HandleSecretsChange("test-namespace", mockApps, mockSecrets)
	app, _ := mockApps.ReadByName("test-app")
	if len(app.Status.Services) != 1 {
		t.Fatalf("mobile client validation failed")
	}
	mockSecrets2 := NewMockSecretsCRUDL2()
	HandleSecretsChange("test-namespace", mockApps, mockSecrets2)
	app, _ = mockApps.ReadByName("test-app")
	if len(app.Status.Services) != 0 {
		t.Fatalf("mobile client validation failed")
	}
}
