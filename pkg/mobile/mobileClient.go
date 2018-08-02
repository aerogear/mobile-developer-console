package mobile

import (
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	"errors"
	"github.com/operator-framework/operator-sdk/pkg/sdk"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type MobileClientRepoImpl struct {
	validator MobileClientValidator
	namespace string
}

type DefaultMobileClientValidator struct {

}

func (v *DefaultMobileClientValidator) Validate(client *v1alpha1.MobileClient) bool {
	//TODO: Implement me
	return true
}

func NewMobileClientRepo(namespace string, validator MobileClientValidator) *MobileClientRepoImpl {
	v := validator
	if v == nil {
		v = &DefaultMobileClientValidator{}
	}
	return &MobileClientRepoImpl{
		validator: v,
		namespace: namespace,
	}
}

func (r *MobileClientRepoImpl) ReadByName(name string) (*v1alpha1.MobileClient, error) {
	c := &v1alpha1.MobileClient{
		ObjectMeta: metav1.ObjectMeta{
			Name:name,
			Namespace:r.namespace,
		},
	}
	getOpts := sdk.WithGetOptions(&metav1.GetOptions{})
	err := sdk.Get(c, getOpts)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *MobileClientRepoImpl) Update(app *v1alpha1.MobileClient) error {
	if !r.validator.Validate(app) {
		return errors.New("app validation failed")
	}
	return sdk.Update(app)
}

func (r *MobileClientRepoImpl) List(namespace string) (*v1alpha1.MobileClientList, error) {
	listOpts := sdk.WithListOptions(&metav1.ListOptions{})
	list := &v1alpha1.MobileClientList{}
	err := sdk.List(r.namespace, list, listOpts)
	if err != nil {
		return nil, err
	}
	return list, nil
}

func (r *MobileClientRepoImpl) DeleteByName(name string) error {
	o, err := r.ReadByName(name)
	if err != nil {
		return err
	}
	deleteOpt := sdk.WithDeleteOptions(&metav1.DeleteOptions{})
	return sdk.Delete(o, deleteOpt)
}

func (r *MobileClientRepoImpl) Create(app *v1alpha1.MobileClient) error {
	if !r.validator.Validate(app) {
		return errors.New("app validation failed")
	}
	return sdk.Create(app)
}