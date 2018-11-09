package stub

import (
	"time"

	"k8s.io/apimachinery/pkg/watch"
)

func Watch(getWatchInterface func() (watch.Interface, error), handleChange func()) {
	watchInterface, err := getWatchInterface()
	if err != nil {
		return
	}
	events := watchInterface.ResultChan()
	defer func() {
		if watchInterface != nil {
			watchInterface.Stop()
		}
	}()
	willHandle := false
	for {
		select {
		case _, ok := <-events:
			if !ok {
				watchInterface.Stop()
				watchInterface, err = getWatchInterface()
				if err != nil {
					return
				}
				events = watchInterface.ResultChan()
				continue
			}
			if willHandle {
				continue
			}

			// this makes sure that there will be only one call of handleChange in case there are more
			// events notifying about change in the same time
			willHandle = true
			timer := time.NewTimer(time.Second)
			go func(timer *time.Timer) {
				<-timer.C
				willHandle = false
				handleChange()
			}(timer)
		}
	}
}
