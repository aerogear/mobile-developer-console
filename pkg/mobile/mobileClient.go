package mobile

import (
	"context"
	"sync"
	"time"

	"github.com/aerogear/mobile-developer-console/pkg/apis/aerogear/v1alpha1"
	"github.com/operator-framework/operator-sdk/pkg/sdk"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
)

var (
	handler *MobileHandler
	m       sync.Mutex
)

type MobileClientRepoImpl struct {
	namespace string
}

func NewMobileClientRepo(namespace string) *MobileClientRepoImpl {
	return &MobileClientRepoImpl{
		namespace: namespace,
	}
}

func (r *MobileClientRepoImpl) ReadByName(name string) (*v1alpha1.MobileClient, error) {
	c := &v1alpha1.MobileClient{
		TypeMeta: metav1.TypeMeta{
			Kind:       "MobileClient",
			APIVersion: "mobile.k8s.io/v1alpha1",
		},
		ObjectMeta: metav1.ObjectMeta{
			Name:      name,
			Namespace: r.namespace,
		},
	}
	getOpts := sdk.WithGetOptions(&metav1.GetOptions{})
	err := sdk.Get(c, getOpts)
	if err != nil {
		return nil, err
	}
	return c, nil
}

func (r *MobileClientRepoImpl) Update(app *v1alpha1.MobileClient) error {
	return sdk.Update(app)
}

func (r *MobileClientRepoImpl) List() (*v1alpha1.MobileClientList, error) {
	listOpts := sdk.WithListOptions(&metav1.ListOptions{})
	list := &v1alpha1.MobileClientList{
		TypeMeta: metav1.TypeMeta{
			Kind:       "MobileClient",
			APIVersion: "mobile.k8s.io/v1alpha1",
		},
	}
	err := sdk.List(r.namespace, list, listOpts)
	if err != nil {
		return nil, err
	}
	return list, nil
}

func (r *MobileClientRepoImpl) DeleteByName(name string) error {
	o, err := r.ReadByName(name)
	if err != nil {
		return err
	}
	deleteOpt := sdk.WithDeleteOptions(&metav1.DeleteOptions{})
	return sdk.Delete(o, deleteOpt)
}

func (r *MobileClientRepoImpl) Create(app *v1alpha1.MobileClient) error {
	return sdk.Create(app)
}

type MobileWatcher struct {
	events chan watch.Event
}

func (w MobileWatcher) Stop() {
	done := make(chan struct{})
	go func() {
		drain := true
		for drain {
			select {
			case <-done:
				drain = false
			case <-w.events:
			case <-time.After(1 * time.Second):
			}
		}
	}()
	handler.RemoveWatcher(w)
	done <- struct{}{}
}

func (w MobileWatcher) ResultChan() <-chan watch.Event {
	return w.events
}

type MobileHandler struct {
	watchers map[MobileWatcher]struct{}
}

func NewMobileHandler() *MobileHandler {
	watchers := make(map[MobileWatcher]struct{})
	return &MobileHandler{watchers}
}

func (h MobileHandler) Handle(c context.Context, e sdk.Event) error {
	h.NotifyWatchers()
	return nil
}

func (h *MobileHandler) NotifyWatchers() {
	m.Lock()
	for watcher := range h.watchers {
		watcher.events <- watch.Event{
			Type:   "MobileAppsEvent",
			Object: nil,
		}
	}
	m.Unlock()
}

func (h *MobileHandler) AddWatcher(watcher MobileWatcher) {
	h.watchers[watcher] = struct{}{}
}

func (h *MobileHandler) RemoveWatcher(watcher MobileWatcher) {
	m.Lock()
	delete(h.watchers, watcher)
	m.Unlock()
}

func (r *MobileClientRepoImpl) Watch() (watch.Interface, error) {
	if handler == nil {
		sdk.Watch("mobile.k8s.io/v1alpha1", "MobileClient", r.namespace, 0)
		handler = NewMobileHandler()
		sdk.Handle(handler)
	}
	watcher := MobileWatcher{
		events: make(chan watch.Event),
	}
	handler.AddWatcher(watcher)
	return watcher, nil
}
