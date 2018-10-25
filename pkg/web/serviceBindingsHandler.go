package web

import (
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	"github.com/labstack/echo"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BindableMobileServiceHandler struct {
	namespace             string
	bindableServiceLister mobile.BindableMobileServiceLister
}

func NewMobileServiceBindingsHandler(bindableServiceLister mobile.BindableMobileServiceLister, namespace string) *BindableMobileServiceHandler {
	return &BindableMobileServiceHandler{
		bindableServiceLister: bindableServiceLister,
		namespace:             namespace,
	}
}

func (msih *BindableMobileServiceHandler) List(c echo.Context) error {
	si, err := msih.bindableServiceLister.List(msih.namespace)
	if err != nil {
		c.Logger().Errorf("error listing service bindings %v", err)
		return c.NoContent(http.StatusInternalServerError)
	}
	return c.JSON(http.StatusOK, si)
}

func (msih *BindableMobileServiceHandler) Create(c echo.Context) error {
	reqData := new(ServiceBindingCreateRequest)
	if err := c.Bind(&reqData); err != nil {
		return err
	}

	if err := c.Validate(reqData); err != nil {
		return err
	}

	binding := newMobileBindingObject(*reqData)
	binding, err := msih.bindableServiceLister.Create(msih.namespace, binding, reqData.FormData)

	if err != nil {
		return err
	}

	return c.JSON(200, binding)
}

func newMobileBindingObject(data ServiceBindingCreateRequest) *scv1beta1.ServiceBinding {

	keyRef := scv1beta1.SecretKeyReference{
		Key:  "parameters",
		Name: data.BindingParametersKey,
	}

	consumerID := data.FormData["CLIENT_ID"].(string)

	return &scv1beta1.ServiceBinding{
		TypeMeta: metav1.TypeMeta{
			Kind:       "ServiceBinding",
			APIVersion: "servicecatalog.k8s.io/v1beta1",
		},
		ObjectMeta: metav1.ObjectMeta{
			GenerateName: consumerID + "-" + data.ServiceClassExternalName + "-",
			Annotations: map[string]string{
				"binding.aerogear.org/consumer": consumerID,
				"binding.aerogear.org/provider": data.ServiceInstanceName,
			},
		},
		Spec: scv1beta1.ServiceBindingSpec{
			ServiceInstanceRef: scv1beta1.LocalObjectReference{
				Name: data.ServiceInstanceName,
			},
			SecretName: data.BindingSecretKey,
			ParametersFrom: []scv1beta1.ParametersFromSource{{
				SecretKeyRef: &keyRef,
			},
			},
		},
	}
}

/*
var getMobileBindingMetadata = function(svcToBind, serviceClass) {
      var consumerId = _.get(ctrl, 'parameterData.CLIENT_ID');
      var annotations = {};
      annotations[mobileBindingConsumerAnnotation] = consumerId;
      annotations[mobileBindingProviderAnnotation] = _.get(svcToBind, 'metadata.name');
      return {
        generateName: consumerId.toLowerCase() + '-' + _.get(serviceClass, 'spec.externalMetadata.serviceName').toLowerCase() + '-',
        annotations: annotations
      };
    };
*/
