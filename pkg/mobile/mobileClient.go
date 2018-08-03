package mobile

import (
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	"github.com/operator-framework/operator-sdk/pkg/sdk"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type MobileClientRepoImpl struct {
	namespace string
}

func NewMobileClientRepo(namespace string) *MobileClientRepoImpl {
	return &MobileClientRepoImpl{
		namespace: namespace,
	}
}

func (r *MobileClientRepoImpl) ReadByName(name string) (*v1alpha1.MobileClient, error) {
	c := &v1alpha1.MobileClient{
		TypeMeta: metav1.TypeMeta{
			Kind:       "MobileClient",
			APIVersion: "aerogear.org/v1alpha1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: r.namespace,
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
	return sdk.Update(app)
}

func (r *MobileClientRepoImpl) List(namespace string) (*v1alpha1.MobileClientList, error) {
	listOpts := sdk.WithListOptions(&metav1.ListOptions{})
	list := &v1alpha1.MobileClientList{
		TypeMeta: metav1.TypeMeta{
			Kind:       "MobileClient",
			APIVersion: "aerogear.org/v1alpha1",
		},
	}
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
	return sdk.Create(app)
}
