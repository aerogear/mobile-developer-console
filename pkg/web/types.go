package web

import (
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

//MobileAppCreateRequest is the data type for the create request
type MobileAppCreateRequest struct {
	//has to be unique per namespace, can not be changed later
	Name          string `json:"name" validate:"required"`
	ClientType    string `json:"clientType" validate:"required,oneof=android iOS cordova xamarin"`
	AppIdentifier string `json:"appIdentifier"" validate:"required"`
	DmzUrl        string `json:"dmzUrl"`
}

//MobileAppUpdateRequest is the data type for the update request
type MobileAppUpdateRequest struct {
	AppIdentifier string `json:"appIdentifier" validate:"required"`
}

//MobileClientServiceData represents the services in the `mobile-services.json` file
type MobileClientServiceData struct {
	Id     string                 `json:"id"`
	Name   string                 `json:name`
	Type   string                 `json:type`
	Url    string                 `json:url`
	Config map[string]interface{} `json:"config"`
}

//MobileClientData represents the API data for the MobileClient
type MobileClientData struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata"`
	Spec              v1alpha1.MobileClientSpec `json:"spec"`
	Status            MobileClientStatusData    `json:"status"`
}

//MobileClientStatusData represents the content in the `mobile-services.json` file
type MobileClientStatusData struct {
	Version     int                       `json:"version"`
	ClusterName string                    `json:"clusterName"`
	Namespace   string                    `json:"namespace"`
	ClientId    string                    `json:"clientId"`
	Services    []MobileClientServiceData `json:"services"`
}

//MobileClientDataList is the list of MobileClientServiceData
type MobileClientDataList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata"`
	Items           []MobileClientData `json:"items"`
}

type BasicAuthConfig struct {
	Name     string `json:"name" validate:"required"`
	Username string `json:"username" validate:"required"`
	Password string `json:"password" validate:"required"`
}

type SSHAuthConfig struct {
	Name       string `json:"name" validate:"required"`
	PrivateKey string `json:"privateKey" validate:"required"`
}

type SourceConfig struct {
	GitURL          string           `json:"gitUrl" validate:"required"`
	GitRef          string           `json:"gitRef" validate:"required"`
	JenkinsFilePath string           `json:"jenkinsFilePath" validate:"required"`
	AuthType        string           `json:"authType" validate:"required,oneof=public basic ssh"`
	BasicAuth       *BasicAuthConfig `json:"basicAuth"`
	SSHAuth         *SSHAuthConfig   `json:"sshAuth"`
}

type AndroidCredentialsConfig struct {
	Name             string `json:"name" validate:"required"`
	Keystore         string `json:"keystore" validate:"required"`
	KeystorePassword string `json:"keystorePassword" validate:"required"`
	KeystoreAlias    string `json:"keystoreAlias" validate:"required"`
}

type IOSCredentialsConfig struct {
	Name             string `json:"name" validate:"required"`
	DeveloperProfile string `json:"developerProfile" validate:"required"`
	ProfilePassword  string `json:"profilePassword" validate:"required"`
}

type BuildConfig struct {
	Platform           string                    `json:"platform" validate:"required,oneof=android iOS"`
	BuildType          string                    `json:"buildType" validate:"required,oneof=debug release"`
	AndroidCredentials *AndroidCredentialsConfig `json:"androidCredentials"`
	IOSCredentials     *IOSCredentialsConfig     `json:"iosCredentials"`
}

//BuildConfigCreateRequest is the data type for the create request
type BuildConfigCreateRequest struct {
	Name                 string          `json:"name" validate:"required"`
	ClientID             string          `json:"clientId" validate:"required"`
	ClientType           string          `json:"clientType" validate:"required,oneof=android iOS cordova xamarin"`
	Source               SourceConfig    `json:"source" validate:"required"`
	Build                BuildConfig     `json:"build" validate:"required"`
	EnvironmentVariables []corev1.EnvVar `json:"envVars"`
}
