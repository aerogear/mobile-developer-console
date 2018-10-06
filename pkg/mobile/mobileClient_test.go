package mobile

import (
	"sync"
	"testing"
	"time"

	"github.com/operator-framework/operator-sdk/pkg/sdk"
	"k8s.io/apimachinery/pkg/watch"
)

// this test will create two watchers and send two notifications
// it should verify that:
//   - when there are watchers registered, they all receive notification
//   - and when watcher unregisters, it will not receive more notifications,
//     but the rest of the watchers will do
func TestMobileHandler(t *testing.T) {
	handler = NewMobileHandler()
	watcher1 := MobileWatcher{events: make(chan watch.Event)}
	watcher2 := MobileWatcher{events: make(chan watch.Event)}
	handler.AddWatcher(watcher1)
	handler.AddWatcher(watcher2)
	go func() {
		for index := 0; index < 2; index++ {
			handler.Handle(nil, sdk.Event{Object: nil, Deleted: false})
		}
	}()
	var wg sync.WaitGroup
	err := make(chan string)
	wg.Add(2)
	go func() {
		defer wg.Done()
		resultChan1 := watcher1.ResultChan()
		select {
		case <-resultChan1:
		case <-time.After(1 * time.Second):
			err <- "Expected to receive notification for first watcher"
			return
		}
		watcher1.Stop()
		select {
		case <-resultChan1:
			err <- "Expected not to receive notification"
			return
		case <-time.After(1 * time.Second):
		}
	}()
	go func() {
		defer wg.Done()
		resultChan2 := watcher2.ResultChan()
		for index := 0; index < 2; index++ {
			select {
			case <-resultChan2:
			case <-time.After(1 * time.Second):
				err <- "Expected to receive notification for second watcher"
				return
			}
		}

	}()
	wg.Wait()
	if len(err) > 0 {
		t.Fatalf(<-err)
	}
}
