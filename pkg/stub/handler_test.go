package stub

import (
	"testing"

	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	v12 "k8s.io/api/core/v1"
	errors2 "k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"

	"context"
	"encoding/json"
	"errors"

	"github.com/operator-framework/operator-sdk/pkg/sdk"
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

func createSecret(labels map[string]string, data map[string][]byte, version string) v12.Secret {
	secret := v12.Secret{
		TypeMeta: metav1.TypeMeta{},
		ObjectMeta: metav1.ObjectMeta{
			Labels:          labels,
			ResourceVersion: version,
		},
		Data: data,
	}
	return secret
}

func TestHandler(t *testing.T) {
	cases := []struct {
		Name           string
		Mobile         string
		ClientId       string
		Id             string
		Version        string
		SecretConfig   string
		Event          func(secret v12.Secret) sdk.Event
		ExpectedSize   int
		ExpectError    bool
		ValidateClient func(mobileClient *v1alpha1.MobileClient) error
	}{
		{
			Name:         "test add service",
			ExpectedSize: 1,
			ClientId:     "test-app",
			Id:           "test-service",
			Mobile:       "enabled",
			Version:      "1",
			Event: func(secret v12.Secret) sdk.Event {
				e := sdk.Event{
					Object:  secret.DeepCopyObject(),
					Deleted: false,
				}
				return e
			},
			ExpectError:  false,
			SecretConfig: "{\"test\":\"test\"}",
			ValidateClient: func(mobileClient *v1alpha1.MobileClient) error {
				service := &mobileClient.Status.Services[0]
				if service == nil {
					return errors.New("service is not defined")
				}
				config := service.Config
				data := make(map[string]string)
				if err := json.Unmarshal(config, &data); err != nil {
					return err
				}
				if data["test"] != "test" {
					return errors.New("config data is not valid")
				}
				return nil
			},
		},
		{
			Name:         "test update",
			ExpectedSize: 1,
			ClientId:     "test-app",
			Id:           "test-service",
			Mobile:       "enabled",
			Version:      "2",
			Event: func(secret v12.Secret) sdk.Event {
				e := sdk.Event{
					Object:  secret.DeepCopyObject(),
					Deleted: false,
				}
				return e
			},
			ExpectError:  false,
			SecretConfig: "{\"test\":\"test-updated\"}",
			ValidateClient: func(mobileClient *v1alpha1.MobileClient) error {
				service := &mobileClient.Status.Services[0]
				if service == nil {
					return errors.New("service is not defined")
				}
				config := service.Config
				data := make(map[string]string)
				if err := json.Unmarshal(config, &data); err != nil {
					return err
				}
				if data["test"] != "test-updated" {
					return errors.New("config data is not valid")
				}
				return nil
			},
		},
		{
			Name:         "test update ignored",
			ExpectedSize: 1,
			ClientId:     "test-app",
			Id:           "test-service",
			Mobile:       "enabled",
			Version:      "2",
			Event: func(secret v12.Secret) sdk.Event {
				e := sdk.Event{
					Object:  secret.DeepCopyObject(),
					Deleted: false,
				}
				return e
			},
			ExpectError:  false,
			SecretConfig: "{\"test\":\"test-updated\"}",
			ValidateClient: func(mobileClient *v1alpha1.MobileClient) error {
				service := &mobileClient.Status.Services[0]
				if service == nil {
					return errors.New("service is not defined")
				}
				config := service.Config
				data := make(map[string]string)
				if err := json.Unmarshal(config, &data); err != nil {
					return err
				}
				if data["test"] != "test-updated" {
					return errors.New("config data is not valid")
				}
				return nil
			},
		},
		{
			Name:         "test invalid secret",
			ExpectedSize: 1,
			ClientId:     "test-app",
			Id:           "test-service",
			Mobile:       "",
			Version:      "2",
			Event: func(secret v12.Secret) sdk.Event {
				e := sdk.Event{
					Object:  secret.DeepCopyObject(),
					Deleted: false,
				}
				return e
			},
			ExpectError: false,
		},
		{
			Name:         "test delete invalid service",
			ExpectedSize: 1,
			ClientId:     "test-app",
			Id:           "non-existent-service",
			Mobile:       "",
			Version:      "2",
			Event: func(secret v12.Secret) sdk.Event {
				e := sdk.Event{
					Object:  secret.DeepCopyObject(),
					Deleted: true,
				}
				return e
			},
			ExpectError: false,
		},
		{
			Name:         "test remove service",
			ExpectedSize: 0,
			ClientId:     "test-app",
			Id:           "test-service",
			Mobile:       "enabled",
			Version:      "2",
			Event: func(secret v12.Secret) sdk.Event {
				e := sdk.Event{
					Object:  secret.DeepCopyObject(),
					Deleted: true,
				}
				return e
			},
			ExpectError: false,
		},
	}

	client := &v1alpha1.MobileClient{
		ObjectMeta: metav1.ObjectMeta{
			Name: "test-app",
		},
		Spec: v1alpha1.MobileClientSpec{
			Name: "test-app",
		},
	}
	mockAppRepo := NewMockMobileClientRepo()
	mockAppRepo.Create(client)

	for _, tc := range cases {
		labels := make(map[string]string)
		labels["mobile"] = tc.Mobile
		labels["clientId"] = tc.ClientId
		data := make(map[string][]byte)
		data["id"] = []byte(tc.Id)
		if tc.SecretConfig != "" {
			data["config"] = []byte(tc.SecretConfig)
		}
		secret := createSecret(labels, data, tc.Version)
		e := tc.Event(secret)
		t.Run(tc.Name, func(t *testing.T) {
			app, err := mockAppRepo.ReadByName("test-app")
			h := NewHandler(mockAppRepo)
			h.Handle(context.TODO(), e)
			if tc.ExpectError && err == nil {
				t.Fatalf("expected an error but got none")
			}
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			if len(app.Status.Services) != tc.ExpectedSize {
				t.Fatal("Service was not add/removed")
			}
			if tc.ValidateClient != nil {
				a, _ := mockAppRepo.ReadByName("test-app")
				err := tc.ValidateClient(a)
				if err != nil {
					t.Fatalf("mobile client validation failed")
				}
			}
		})
	}
}
