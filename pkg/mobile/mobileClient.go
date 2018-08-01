package mobile

import (
	"github.com/aerogear/mobile-client-service/pkg/apis/aerogear/v1alpha1"
	"github.com/operator-framework/operator-sdk/pkg/sdk"
	)

type MobileClientRepoImpl struct {

}

func NewMobileClientRepo() *MobileClientRepoImpl {
	return &MobileClientRepoImpl{
	}
}

func (r *MobileClientRepoImpl) ReadByName(name string) (*v1alpha1.MobileClient, error) {
	panic("implement me")
}

func (r *MobileClientRepoImpl) Update(app v1alpha1.MobileClient) (*v1alpha1.MobileClient, error) {
	panic("implement me")
}

func (r *MobileClientRepoImpl) List(namespace string) (*v1alpha1.MobileClientList, error) {
	panic("implement me")
}

func (r *MobileClientRepoImpl) DeleteByName(name string) error {
	panic("implement me")
}



func (r *MobileClientRepoImpl) Create(app *v1alpha1.MobileClient) error {
	//TODO: add validation of data
	return sdk.Create(app)
}