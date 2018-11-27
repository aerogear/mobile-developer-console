package mobile

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	"k8s.io/apimachinery/pkg/watch"
)

//TODO: if required, we should make this configurable from the tests
type MockBindableMobileServiceCRUDL struct {
}

func NewMockBindableServices() *MockBindableMobileServiceCRUDL {
	return &MockBindableMobileServiceCRUDL{}
}

func (m *MockBindableMobileServiceCRUDL) Create(binding *scv1beta1.ServiceBinding, formData map[string]interface{}) (*scv1beta1.ServiceBinding, error) {
	return binding, nil
}

func (m *MockBindableMobileServiceCRUDL) Delete(namespace string, bindingName string) error {
	return nil
}

func (m *MockBindableMobileServiceCRUDL) Watch(mobileClient *v1alpha1.MobileClient) func() (watch.Interface, error) {
	return nil
}

func (m *MockBindableMobileServiceCRUDL) List(mobileClient *v1alpha1.MobileClient) (*BindableMobileServiceList, error) {
	b := BindableMobileService{}
	list := BindableMobileServiceList{
		Items: []BindableMobileService{b},
	}
	return &list, nil
}

func (m *MockBindableMobileServiceCRUDL) NewBindingObject(data ServiceBindingCreateRequest, client *v1alpha1.MobileClient) *scv1beta1.ServiceBinding {
	return &scv1beta1.ServiceBinding{}
}

func (m *MockBindableMobileServiceCRUDL) DeleteBindingsForApp(client *v1alpha1.MobileClient) error {
	return nil
}
