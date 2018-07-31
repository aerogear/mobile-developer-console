package mobile

import (
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	buildV1 "github.com/openshift/api/build/v1"
)

//ServiceInstanceList represents a list of mobile service instances
type ServiceInstanceList = scv1beta1.ServiceInstanceList

//ServiceInstance represents a service instance that can be consumed by mobile clients
type ServiceInstance = scv1beta1.ServiceInstance

type Build = buildV1.Build
type BuildList = buildV1.BuildList
type BuildConfig = buildV1.BuildConfig
type BuildConfigList = buildV1.BuildConfigList
