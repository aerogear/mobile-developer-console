package stub

import (
	"context"

	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/operator-framework/operator-sdk/pkg/sdk"
	log "github.com/sirupsen/logrus"
	"k8s.io/api/core/v1"
)

func NewHandler(mobileAppRepo mobile.MobileClientRepo) sdk.Handler {
	return &Handler{
		mobileClientRepo: mobileAppRepo,
	}
}

type Handler struct {
	// Fill me
	mobileClientRepo mobile.MobileClientRepo
}

func (h *Handler) Handle(ctx context.Context, event sdk.Event) error {
	switch o := event.Object.(type) {
	case *v1.Secret:
		secret := o

		if !isValidSecret(secret) {
			return nil
		}

		labels := secret.GetLabels()
		clientId := labels["clientId"]

		app, err := h.mobileClientRepo.ReadByName(clientId)
		if err != nil {
			log.Errorf("failed to read mobile client by name %v", clientId)
			return err
		}

		serviceId := string(secret.Data["id"])
		services := app.Status.Services
		existing, i := findService(services, serviceId)

		if event.Deleted && existing != nil {
			log.Infof("remove service %v from app %v", serviceId, clientId)
			//we should remove the existing from the services
			services = removeService(services, i)
			app.Status.Services = services
			err := h.mobileClientRepo.Update(app)
			if err != nil {
				log.Errorf("failed to update mobile client %v", err)
				return err
			}
			return nil
		}

		log.Infof("add/update service %v to app %v", serviceId, clientId)
		service, err := newMobileServiceFromSecret(secret)
		if err != nil {
			log.Errorf("failed to create service from secret due to error: %v", err)
			return err
		}

		if existing != nil && existing.Version == service.Version {
			log.Infof("ignore service %v as it is not changed", serviceId)
			return nil
		}

		if existing != nil {
			log.Infof("update an existing service %v, remove it first", serviceId)
			services = removeService(services, i)
		}

		services = append(services, *service)
		app.Status.Services = services
		err = h.mobileClientRepo.Update(app)
		if err != nil {
			log.Errorf("failed to update mobile client %v", err)
			return err
		}
		return nil
	}
	log.Warnf("Unexpected data type received: %v", event.Object.GetObjectKind())
	return nil
}

func isValidSecret(secret *v1.Secret) bool {
	labels := secret.GetLabels()
	if labels["mobile"] != "" && labels["clientId"] != "" && secret.Data["id"] != nil {
		return true
	}
	return false
}

func findService(services []v1alpha1.MobileClientService, serviceId string) (*v1alpha1.MobileClientService, int) {
	for i, service := range services {
		if service.Id == serviceId {
			return &service, i
		}
	}
	return nil, -1
}

func removeService(services []v1alpha1.MobileClientService, index int) []v1alpha1.MobileClientService {
	s := append(services[:index], services[index+1:]...)
	return s
}

func newMobileServiceFromSecret(secret *v1.Secret) (*v1alpha1.MobileClientService, error) {
	return &v1alpha1.MobileClientService{
		Id:      string(secret.Data["id"]),
		Name:    string(secret.Data["name"]),
		Type:    string(secret.Data["type"]),
		Url:     string(secret.Data["uri"]),
		Config:  secret.Data["config"],
		Version: secret.ResourceVersion,
	}, nil
}
