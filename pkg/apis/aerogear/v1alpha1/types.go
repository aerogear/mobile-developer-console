package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

type MobileClientList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata"`
	Items           []MobileClient `json:"items"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

type MobileClient struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata"`
	Spec              MobileClientSpec   `json:"spec"`
	Status            MobileClientStatus `json:"status,omitempty"`
}

type MobileClientSpec struct {
	// Fill me
	ClientType    string `json:"clientType,required"`
	Name          string `json:"name,required"`
	AppIdentifier string `json:appIdentifier,required`
	ApiKey        string `json:apiKey` //TODO: not sure if this is still required.
	DmzUrl        string `json:dmzUrl`
}

//for mobile-services.json
type MobileClientStatus struct {
	Version     int                   `json:"version"`
	ClusterName string                `json:"clusterName"`
	Namespace   string                `json:"namespace"`
	ClientId    string                `json:"clientId"`
	Services    []MobileClientService `json:"services"`
}

type MobileClientService struct {
	Id     string            `json:"id"`
	Name   string            `json:name`
	Type   string            `json:type`
	Url    string            `json:url`
	Config map[string]string `json:"config"`
}
