package mobile

import (
	mcv1alpha1 "github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	buildV1 "github.com/openshift/api/build/v1"
)

//ServiceInstanceList represents a list of mobile service instances
type ServiceInstanceList = scv1beta1.ServiceInstanceList

//ServiceInstance represents a service instance that can be consumed by mobile clients
type ServiceInstance = scv1beta1.ServiceInstance

//ServiceBinding represents a mobile service instance binding
type ServiceBinding = scv1beta1.ServiceBinding

//ServicePlan represents a mobile plan
type ServicePlan = scv1beta1.ClusterServicePlan

type Build = buildV1.Build
type BuildList = buildV1.BuildList
type BuildConfig = buildV1.BuildConfig
type BuildConfigList = buildV1.BuildConfigList

//BindableMobileService is the type that backs services on the Mobile Services page
type BindableMobileService struct {
	IsBound         bool                          `json:"isBound" validate:"required"`
	Name            string                        `json:"name" validate:"required"`
	ImageURL        string                        `json:"imageUrl,omitempty"`
	IconClass       string                        `json:"iconClass,omitempty"`
	Configuration   []string                      `json:"configuration,omitempty"`
	ServiceInstance scv1beta1.ServiceInstance     `json:"serviceInstance"`
	ServiceBinding  scv1beta1.ServiceBinding      `json:"serviceBinding"`
	ServiceClass    scv1beta1.ClusterServiceClass `json:"serviceClass"`
	ServicePlan     ServicePlan                   `json:"servicePlan"`
	MobileClient    mcv1alpha1.MobileClient       `json:"mobileClient"`
}

//BindableMobileServiceList is a List of BindableMobileServices
type BindableMobileServiceList struct {
	Items []BindableMobileService `json:"items"`
}
