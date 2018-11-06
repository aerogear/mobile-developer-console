package web

import (
	"net/http"

	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	scv1beta1 "github.com/kubernetes-incubator/service-catalog/pkg/apis/servicecatalog/v1beta1"
	"github.com/labstack/echo"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type BindableMobileServiceHandler struct {
	namespace            string
	bindableServiceCRUDL mobile.BindableMobileServiceCRUDL
}

func NewMobileServiceBindingsHandler(bindableServiceCRUDL mobile.BindableMobileServiceCRUDL, namespace string) *BindableMobileServiceHandler {
	return &BindableMobileServiceHandler{
		bindableServiceCRUDL: bindableServiceCRUDL,
		namespace:            namespace,
	}
}

func (msih *BindableMobileServiceHandler) List(c echo.Context) error {
	mobileClientName := c.Param("name")
	si, err := msih.bindableServiceCRUDL.List(msih.namespace, mobileClientName)
	if err != nil {
		c.Logger().Errorf("error listing service bindings %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, si)
}

func (msih *BindableMobileServiceHandler) Delete(c echo.Context) error {
	name := c.Param("name")
	err := msih.bindableServiceCRUDL.Delete(msih.namespace, name)
	if err != nil {
		c.Logger().Errorf("error deleting service binding %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusOK)
}

func (msih *BindableMobileServiceHandler) Create(c echo.Context) error {
	reqData := new(ServiceBindingCreateRequest)
	if err := c.Bind(&reqData); err != nil {
		c.Logger().Errorf("Could not bind request to ServiceBindingCreateRequest %v", err)
		return c.String(http.StatusBadRequest, err.Error())
	}

	if err := c.Validate(reqData); err != nil {
		c.Logger().Errorf("Binding Creation failed validation %v", err)
		return c.String(http.StatusBadRequest, err.Error())
	}

	binding := newMobileBindingObject(*reqData)
	binding, err := msih.bindableServiceCRUDL.Create(msih.namespace, binding, reqData.FormData)

	if err != nil {
		c.Logger().Errorf("error creating service binding %v", err)
		return c.String(http.StatusInternalServerError, err.Error())
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
