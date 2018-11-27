package mobile

import "github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"

type AppDeleterImpl struct {
	mobileClientRepo MobileClientRepo
	appDataDeleters  []AppDataDeleter
}

func NewAppDeleter(mobileClientRepo MobileClientRepo, deleters ...AppDataDeleter) *AppDeleterImpl {
	return &AppDeleterImpl{
		mobileClientRepo: mobileClientRepo,
		appDataDeleters:  deleters,
	}
}

func (deleter *AppDeleterImpl) Delete(mobileClient *v1alpha1.MobileClient) error {
	for _, d := range deleter.appDataDeleters {
		err := d.DeleteAppData(mobileClient)
		if err != nil {
			return err
		}
	}

	err := deleter.mobileClientRepo.DeleteByName(mobileClient.GetName())
	if err != nil {
		return err
	}

	return nil
}
