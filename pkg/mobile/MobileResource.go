package mobile

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/dynamic"
)

type MobileResourceListerImpl struct {
	client dynamic.ResourceInterface
}

func NewMobileResourceLister(client dynamic.ResourceInterface) *MobileResourceListerImpl {
	return &MobileResourceListerImpl{
		client: client,
	}
}

func (lister *MobileResourceListerImpl) List() (runtime.Object, error) {
	return lister.client.List(metav1.ListOptions{})
}
