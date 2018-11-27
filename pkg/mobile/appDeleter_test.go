package mobile

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"k8s.io/apimachinery/pkg/apis/meta/v1"
	"testing"
)

type mockAppDataDeleter struct {
	deleteCalled bool
}

func (m *mockAppDataDeleter) DeleteAppData(client *v1alpha1.MobileClient) error {
	m.deleteCalled = true
	return nil
}

func TestDeleteApp(t *testing.T) {
	mc := &v1alpha1.MobileClient{
		ObjectMeta: v1.ObjectMeta{
			Name:      "testapp",
			Namespace: "test",
		},
	}
	mobileClientRepo := NewMockMobileClientRepo(mc)

	dataDeleter1 := &mockAppDataDeleter{
		deleteCalled: false,
	}
	dataDeleter2 := &mockAppDataDeleter{
		deleteCalled: false,
	}
	appDeleter := NewAppDeleter(mobileClientRepo, dataDeleter1, dataDeleter2)

	err := appDeleter.Delete(mc)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !dataDeleter1.deleteCalled {
		t.Fatalf("Delete method is not called")
	}

	if !dataDeleter2.deleteCalled {
		t.Fatalf("Delete method is not called")
	}

	_, err = mobileClientRepo.ReadByName("testapp")
	if err == nil {
		t.Fatalf("app should be removed")
	}
}
