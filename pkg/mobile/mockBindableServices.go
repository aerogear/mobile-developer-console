package mobile

import (
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
)

//TODO: if required, we should make this configurable from the tests
type MockBindableMobileServiceCRUDL struct {

}

func NewMockBindableServices() *MockBindableMobileServiceCRUDL {
	return &MockBindableMobileServiceCRUDL{}
}

func (m *MockBindableMobileServiceCRUDL) Create(namespace string, binding *scv1beta1.ServiceBinding, formData map[string]interface{}) (*scv1beta1.ServiceBinding, error) {
	return binding, nil
}

func (m *MockBindableMobileServiceCRUDL) Delete(namespace string, bindingName string) error {
	return nil
}

func (m *MockBindableMobileServiceCRUDL) List(namespace string, mobileClientName string) (*BindableMobileServiceList, error) {
	b := BindableMobileService{}
	list := BindableMobileServiceList{
		Items: []BindableMobileService{b},
	}
	return &list, nil
}