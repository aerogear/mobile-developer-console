import { mobileAppDef } from '../models/k8s/definitions';
import { list, get, create, update, remove, watch, OpenShiftWatchEvents } from './openshift';

class AppsService {
  constructor(namespace) {
    this.namespace = namespace;
    this.appDef = mobileAppDef(this.namespace);
  }

  list() {
    return list(this.appDef);
  }

  get(appName) {
    return get(this.appDef, appName);
  }

  create(appObj) {
    return create(this.appDef, appObj);
  }

  update(appObj) {
    return update(this.appDef, appObj);
  }

  remove(name) {
    return remove(this.appDef, { metadata: { name } });
  }

  watch(onMessage, onError) {
    watch(this.appDef).then(watchListener => {
      watchListener
        .onEvent(event => {
          if (event.type !== OpenShiftWatchEvents.OPENED && event.type !== OpenShiftWatchEvents.CLOSED) {
            onMessage();
          }
        })
        .catch(err => {
          onError(err);
        });
    });
  }
}

const appsService = new AppsService(window.OPENSHIFT_CONFIG.mdcNamespace);
export { appsService, AppsService };
