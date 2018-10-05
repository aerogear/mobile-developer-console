package mobile

import (
	"errors"
	"testing"

	ktesting "k8s.io/client-go/testing"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"

	buildV1 "github.com/openshift/api/build/v1"
	"github.com/openshift/client-go/build/clientset/versioned/fake"
	buildv1 "github.com/openshift/client-go/build/clientset/versioned/typed/build/v1"
	corev1 "k8s.io/api/core/v1"
)

func TestListMobileBuilds(t *testing.T) {
	cases := []struct {
		Name             string
		ExpectError      bool
		Client           func() buildv1.BuildV1Interface
		ExpectedListSize int
	}{
		{
			Name:        "test list builds",
			ExpectError: false,
			Client: func() buildv1.BuildV1Interface {
				client := fake.NewSimpleClientset(&Build{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "build1",
						Namespace: "test",
					},
					Status: buildV1.BuildStatus{
						Config: &corev1.ObjectReference{
							Name: "build1",
						},
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
				client.PrependReactor("list", "builds", func(action ktesting.Action) (handled bool, ret runtime.Object, err error) {
					return true, nil, errors.New("injected error")
				})
				return client.BuildV1()
			},
		},
	}

	for _, tc := range cases {
		t.Run(tc.Name, func(t *testing.T) {
			buildCRUDLImpl := NewBuildCRUDL(tc.Client(), "https://test-url:8443")
			buildList, err := buildCRUDLImpl.List("test")
			if tc.ExpectError && err == nil {
				t.Fatalf("expected an error but got none")
			}
			if err != nil && !tc.ExpectError {
				t.Fatalf("unexpected error: %v", err)
			}
			if buildList != nil && len(buildList.Items) != tc.ExpectedListSize {
				t.Fatalf("list items size %v does not equal to %v", len(buildList.Items), tc.ExpectedListSize)
			}
		})
	}
}

func TestBuildURL(t *testing.T) {
	Client := func() buildv1.BuildV1Interface {
		client := fake.NewSimpleClientset(&Build{
			ObjectMeta: metav1.ObjectMeta{
				Name:      "build-1",
				Namespace: "test",
			},
			Status: buildV1.BuildStatus{
				Config: &corev1.ObjectReference{
					Name: "build1",
				},
			},
		})
		return client.BuildV1()
	}

	masterURL := "https://test-url:8443"
	expectedURL := masterURL + "/console/project/test/browse/pipelines/build1/build-1"
	buildCRUDLImpl := NewBuildCRUDL(Client(), masterURL)
	buildList, err := buildCRUDLImpl.List("test")
	if err != nil {
		t.Fatalf("error not expected when listing builds")
	}
	if buildList.Items[0].BuildURL != expectedURL {
		t.Fatalf("build URL %v does not equal to %v", buildList.Items[0].BuildURL, expectedURL)
	}
}
