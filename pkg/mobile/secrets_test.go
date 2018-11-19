package mobile

import (
	"errors"
	"k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	fakecore "k8s.io/client-go/kubernetes/fake"
	"testing"
)

const TESTNAMESPACE = "test"

func TestSecrets(t *testing.T) {
	coreClient := fakecore.NewSimpleClientset()
	s := NewSecretsCRUDL(coreClient.CoreV1())

	cases := []struct{
		Name string
		ExpectError bool
		Action func() error
	} {
		{
			Name: "Create a secret",
			ExpectError: false,
			Action: func() error {
				secret := &v1.Secret{
					ObjectMeta: metav1.ObjectMeta{
						Name: "testsecret",
						Namespace: TESTNAMESPACE,
						Labels: map[string]string{
							"mobile" : "true",
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
			Name: "List secrets",
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
			Name: "Watch secrets",
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

	for _,tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			err := tc.Action()
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}