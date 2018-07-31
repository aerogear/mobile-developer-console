package mobile

import (
	"errors"
	"testing"

	ktesting "k8s.io/client-go/testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	"github.com/openshift/client-go/build/clientset/versioned/fake"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
)

func TestListMobileBuildConfigs(t *testing.T) {
	cases := []struct {
		Name             string
		ExpectError      bool
		Client           func() buildv1.BuildV1Interface
		ExpectedListSize int
	}{
		{
			Name:        "test list build configs",
			ExpectError: false,
			Client: func() buildv1.BuildV1Interface {
				client := fake.NewSimpleClientset(&BuildConfig{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "buildconfig1",
						Namespace: "test",
					},
				})
				return client.BuildV1()
			},
			ExpectedListSize: 1,
		},
		{
			Name:        "test list failure",
			ExpectError: true,
			Client: func() buildv1.BuildV1Interface {
				client := fake.NewSimpleClientset()
				client.PrependReactor("list", "buildconfigs", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return client.BuildV1()
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			buildConfigListImpl := NewBuildConfigLister(tc.Client())
			buildConfigList, err := buildConfigListImpl.List("test")
			if tc.ExpectError && err == nil {
				t.Fatalf("expected an error but got none")
			}
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			if buildConfigList != nil && len(buildConfigList.Items) != tc.ExpectedListSize {
				t.Fatalf("list items size %v does not equal to %v", len(buildConfigList.Items), tc.ExpectedListSize)
			}
		})
	}
}
