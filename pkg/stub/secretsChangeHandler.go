package stub

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/gommon/log"
	"k8s.io/api/core/v1"
)

func HandleSecretsChange(namespace string, mobileAppRepo mobile.MobileClientRepo, secretsCRUDL mobile.SecretsCRUDL) {
	log.Info("handling change in secrets")
	apps, err := mobileAppRepo.List()
	if err != nil {
		return
	}
	secrets, err := secretsCRUDL.List(namespace)
	if err != nil {
		return
	}
	for _, app := range apps.Items {
		newServices := getServicesForAppFromSecrets(secrets, app)
		if servicesChanged(newServices, app.Status.Services) {
			app.Status.Services = newServices
			err := mobileAppRepo.Update(&app)
			if err != nil {
				log.Errorf("failed to update mobile app: %v", err)
				continue
			}
			log.Infof("app %v updated with new services", app.Name)
		}
	}
}

func servicesChanged(newServices []v1alpha1.MobileClientService, existingServices []v1alpha1.MobileClientService) bool {
	if len(existingServices) != len(newServices) {
		return true
	}
	changed := false
	for _, newService := range newServices {
		serviceID := newService.Id
		existing, _ := findService(existingServices, serviceID)
		if existing == nil || existing.Version != newService.Version {
			changed = true
			break
		}
	}
	return changed
}

func getServicesForAppFromSecrets(secrets *v1.SecretList, app v1alpha1.MobileClient) []v1alpha1.MobileClientService {
	var services []v1alpha1.MobileClientService
	for _, secret := range secrets.Items {
		if !isValidSecret(secret) {
			continue
		}
		labels := secret.GetLabels()
		clientID := labels["clientId"]
		if app.Name != clientID {
			continue
		}
		services = append(services, newMobileServiceFromSecret(secret))
	}
	return services
}

func isValidSecret(secret v1.Secret) bool {
	labels := secret.GetLabels()
	//it's important that we do check the data of the secret here, as some services will create temporary secrets which will have the same labels, but not the right data (like push)
	if labels["mobile"] != "" && labels["clientId"] != "" && secret.Data["config"] != nil && secret.Data["uri"] != nil {
		return true
	}
	return false
}

func findService(services []v1alpha1.MobileClientService, serviceID string) (*v1alpha1.MobileClientService, int) {
	for i, service := range services {
		if service.Id == serviceID {
			return &service, i
		}
	}
	return nil, -1
}

func removeService(services []v1alpha1.MobileClientService, index int) []v1alpha1.MobileClientService {
	s := append(services[:index], services[index+1:]...)
	return s
}

func newMobileServiceFromSecret(secret v1.Secret) v1alpha1.MobileClientService {
	return v1alpha1.MobileClientService{
		Id:      string(secret.UID),
		Name:    string(secret.Data["name"]),
		Type:    string(secret.Data["type"]),
		Url:     string(secret.Data["uri"]),
		Config:  secret.Data["config"],
		Version: secret.ResourceVersion,
	}
}
