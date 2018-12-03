package web

import (
	"encoding/json"
	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"github.com/aerogear/mobile-developer-console/pkg/mobile"
	"github.com/labstack/echo"
	"github.com/satori/go.uuid"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"net/http"
)

type MobileClientsHandler struct {
	namespace          string
	mobileClientRepo   mobile.MobileClientRepo
	openshiftMasterURL string
}

func NewMobileClientsHandler(mobileClientRepo mobile.MobileClientRepo, namespace string, openshiftMasterURL string) *MobileClientsHandler {
	return &MobileClientsHandler{
		namespace:          namespace,
		mobileClientRepo:   mobileClientRepo,
		openshiftMasterURL: openshiftMasterURL,
	}
}

func newMobileClientObject(data MobileAppCreateRequest, namespace string) *v1alpha1.MobileClient {
	return &v1alpha1.MobileClient{
		TypeMeta: metav1.TypeMeta{
			Kind:       "MobileClient",
			APIVersion: "mobile.k8s.io/v1alpha1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      data.Name,
			Namespace: namespace,
		},
		Spec: v1alpha1.MobileClientSpec{
			Name:   data.Name,
			ApiKey: uuid.NewV4().String(),
			DmzUrl: data.DmzUrl,
		},
	}
}

func newMobileClientServiceFromObject(service *v1alpha1.MobileClientService) (*MobileClientServiceData, error) {
	c := make(map[string]interface{})
	err := json.Unmarshal(service.Config, &c)
	if err != nil {
		return nil, err
	}
	s := &MobileClientServiceData{
		Id:     service.Id,
		Name:   service.Name,
		Type:   service.Type,
		Url:    service.Url,
		Config: c,
	}
	return s, nil
}

func newMobileClientDataFromObject(app *v1alpha1.MobileClient, openshiftMasterURL string) (*MobileClientData, error) {
	services := make([]MobileClientServiceData, 0)
	for _, service := range app.Status.Services {
		s, err := newMobileClientServiceFromObject(&service)
		if err != nil {
			return nil, err
		}
		services = append(services, *s)
	}
	status := &MobileClientStatusData{
		Version:   1,
		Namespace: app.GetNamespace(),
		ClientId:  app.Spec.Name,
		Services:  services,
	}
	return &MobileClientData{
		TypeMeta:   app.TypeMeta,
		ObjectMeta: app.ObjectMeta,
		Spec:       app.Spec,
		Status:     *status,
	}, nil
}

func newMobileClientDataListFromObjects(list *v1alpha1.MobileClientList, openshiftMasterURL string) (*MobileClientDataList, error) {
	items := make([]MobileClientData, 0)
	for _, app := range list.Items {
		data, err := newMobileClientDataFromObject(&app, openshiftMasterURL)
		if err != nil {
			return nil, err
		}
		items = append(items, *data)
	}
	return &MobileClientDataList{
		TypeMeta: list.TypeMeta,
		ListMeta: list.ListMeta,
		Items:    items,
	}, nil
}

func isNotFoundError(e error) bool {
	switch t := e.(type) {
	case *errors.StatusError:
		if t.ErrStatus.Reason == metav1.StatusReasonNotFound {
			return true
		}
		return false
	default:
		return false
	}
}

func (h *MobileClientsHandler) Create(c echo.Context) error {
	reqData := new(MobileAppCreateRequest)
	if err := c.Bind(reqData); err != nil {
		c.Logger().Errorf("error creating mobile app: %v", err)
		return c.String(http.StatusBadRequest, getErrorMessage(err))
	}
	if err := c.Validate(reqData); err != nil {
		c.Logger().Errorf("error creating mobile app: %v", err)
		return c.String(http.StatusBadRequest, getErrorMessage(err))
	}
	app := newMobileClientObject(*reqData, h.namespace)
	err := h.mobileClientRepo.Create(app)
	if err != nil {
		c.Logger().Errorf("error creating mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	data, err := newMobileClientDataFromObject(app, h.openshiftMasterURL)
	if err != nil {
		c.Logger().Errorf("error creating mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.JSON(http.StatusOK, data)
}

func (h *MobileClientsHandler) Read(c echo.Context) error {
	name := c.Param("name")
	app, err := h.mobileClientRepo.ReadByName(name)
	if err != nil {
		if isNotFoundError(err) {
			c.Logger().Errorf("error reading mobile app: %v", err)
			return c.String(http.StatusNotFound, getErrorMessage(err))
		}
		c.Logger().Errorf("error reading mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	data, err := newMobileClientDataFromObject(app, h.openshiftMasterURL)
	if err != nil {
		c.Logger().Errorf("error reading mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.JSON(http.StatusOK, data)
}

func (h *MobileClientsHandler) List(c echo.Context) error {
	apps, err := h.mobileClientRepo.List()
	if err != nil {
		c.Logger().Errorf("error listing mobile apps: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	data, err := newMobileClientDataListFromObjects(apps, h.openshiftMasterURL)
	if err != nil {
		c.Logger().Errorf("error listing mobile apps: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.JSON(http.StatusOK, data)
}

func (h *MobileClientsHandler) Update(c echo.Context) error {
	name := c.Param("name")
	reqData := new(MobileAppUpdateRequest)
	if err := c.Bind(reqData); err != nil {
		c.Logger().Errorf("error updating mobile app: %v", err)
		return c.String(http.StatusBadRequest, getErrorMessage(err))
	}
	if err := c.Validate(reqData); err != nil {
		c.Logger().Errorf("error updating mobile app: %v", err)
		return c.String(http.StatusBadRequest, getErrorMessage(err))
	}
	app, err := h.mobileClientRepo.ReadByName(name)
	if err != nil {
		if isNotFoundError(err) {
			c.Logger().Errorf("error updating mobile app: %v", err)
			return c.String(http.StatusNotFound, getErrorMessage(err))
		}
		c.Logger().Errorf("error updating mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}

	if reqData.Name != "" {
		app.Spec.Name = reqData.Name
	}

	uerr := h.mobileClientRepo.Update(app)
	if uerr != nil {
		c.Logger().Errorf("error updating mobile app: %v", uerr)
		return c.String(http.StatusInternalServerError, getErrorMessage(uerr))
	}
	data, err := newMobileClientDataFromObject(app, h.openshiftMasterURL)
	if err != nil {
		c.Logger().Errorf("error updating mobile app: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return c.JSON(http.StatusOK, data)
}

func (h *MobileClientsHandler) Watch(c echo.Context) error {
	getWatchInterface := h.mobileClientRepo.Watch()

	err := ServeWS(c, getWatchInterface)
	if err != nil {
		c.Logger().Errorf("error watching mobile apps: %v", err)
		return c.String(http.StatusInternalServerError, getErrorMessage(err))
	}
	return nil
}
