package mobile

import (
	"sync"
	"testing"
	"time"

	"github.com/operator-framework/operator-sdk/pkg/sdk"
	"k8s.io/apimachinery/pkg/watch"
)

func TestMobileHandler(t *testing.T) {
	t.Run("test mobile handler", func(t *testing.T) {
		handler = &MobileHandler{}
		watcher1 := MobileWatcher{events: make(chan watch.Event)}
		watcher2 := MobileWatcher{events: make(chan watch.Event)}
		handler.watchers = append(handler.watchers, watcher1)
		handler.watchers = append(handler.watchers, watcher2)
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
	})
}
