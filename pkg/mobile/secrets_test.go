package mobile

import (
	"errors"
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	fakecore "k8s.io/client-go/kubernetes/fake"
	"testing"
)

const TESTNAMESPACE = "test"

func TestSecrets(t *testing.T) {
	coreClient := fakecore.NewSimpleClientset()
	s := NewSecretsCRUDL(coreClient.CoreV1())

	cases := []struct {
		Name        string
		ExpectError bool
		Action      func() error
	}{
		{
			Name:        "Create a secret",
			ExpectError: false,
			Action: func() error {
				secret := &v1.Secret{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "testsecret",
						Namespace: TESTNAMESPACE,
						Labels: map[string]string{
							"mobile": "true",
						},
					},
				}
				result, err := s.Create(TESTNAMESPACE, secret)
				if err != nil {
					return err
				}
				if result == nil {
					return errors.New("no secret created")
				}
				return nil
			},
		},
		{
			Name:        "List secrets",
			ExpectError: false,
			Action: func() error {
				list, err := s.List(TESTNAMESPACE)
				if err != nil {
					return err
				}
				if len(list.Items) != 1 {
					return errors.New("no secrets returned")
				}
				return nil
			},
		},
		{
			Name:        "Watch secrets",
			ExpectError: false,
			Action: func() error {
				result, err := s.Watch(TESTNAMESPACE)()
				if err != nil {
					return err
				}
				if result == nil {
					return errors.New("no watch interface returned")
				}
				return nil
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			err := tc.Action()
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func TestDeleteSecretsForApp(t *testing.T) {
	s1 := &v1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "secret1",
			Namespace: "test",
			Labels: map[string]string{
				BUILD_CONFIG_LABEL_NAME: "testapp",
			},
		},
	}

	s2 := &v1.Secret{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "secret2",
			Namespace: "test",
		},
	}

	mc := &v1alpha1.MobileClient{
		ObjectMeta: metav1.ObjectMeta{
			Namespace: "test",
			Name:      "testapp",
		},
	}

	coreClient := fakecore.NewSimpleClientset(s1, s2)
	s := NewSecretsCRUDL(coreClient.CoreV1())
	err := s.DeleteAppData(mc)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	list, err := coreClient.CoreV1().Secrets("test").List(metav1.ListOptions{})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if len(list.Items) != 1 {
		t.Fatalf(" there should be 1 secret left in the store")
	}
}
