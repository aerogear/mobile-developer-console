const equal = require('fast-deep-equal');
const mobileClientCRD = require('./mobile-client-crd.json');
const androidVariantCRD = require('./android-variant-crd.json');
const iosVariantCRD = require('./ios-variant-crd.json');
const {
  PushService,
  IdentityManagementService,
  MetricsService,
  DataSyncService,
  MobileSecurityService
} = require('./mobile-services');

const services = [PushService, IdentityManagementService, MetricsService, DataSyncService, MobileSecurityService];

const KEYCLOAK_SECRET_SUFFIX = '-install-config';
const DATASYNC_CONFIGMAP_SUFFIX = '-data-sync-binding';
const MOBILE_SECURITY_SUFFIX = '-security';

let updating = false;

function updateAll(namespace, kubeclient) {
  updating = true;
  console.log('Check services for all apps');
  return kubeclient.apis[mobileClientCRD.spec.group].v1alpha1
    .namespace(namespace)
    .mobileclients.get()
    .then(resp => resp.body)
    .then(mobileclientList => mobileclientList.items)
    .then(mobileclients => mobileclients.map(mobileclient => updateApp(namespace, mobileclient, kubeclient)))
    .then(promises => Promise.all(promises))
    .then(() => {
      updating = false;
    })
    .catch(err => console.error(`Failed to update apps due to error`, err));
}

function updateApp(namespace, app, kubeclient) {
  const oldServices = app.status.services;
  const appName = app.metadata.name;
  return getServicesForApp(namespace, app, kubeclient)
    .then(newServices => [!equal(newServices, oldServices), newServices])
    .then(result => {
      const shouldUpdate = result[0];
      if (shouldUpdate) {
        const newServices = result[1];
        app.status = {
          clientId: appName,
          namespace,
          services: newServices
        };
        console.log(`Update services for app ${appName}`);
        return kubeclient.apis[mobileClientCRD.spec.group].v1alpha1
          .namespace(namespace)
          .mobileclients(appName)
          .put({ body: app });
      }
      return Promise.resolve();
    })
    .catch(err => console.error(`Failed to update app ${app.metadata.name} due to error`, err));
}

function getServicesForApp(namespace, app, kubeclient) {
  const appName = app.metadata.name;
  const promises = services.map(service => service.getClientConfig(namespace, appName, kubeclient));
  return Promise.all(promises).then(serviceConfigs => serviceConfigs.filter(Boolean));
}

async function updateAppsAndWatch(namespace, kubeclient) {
  updateAll(namespace, kubeclient).then(async () => {
    watchMobileClients(namespace, kubeclient);

    const secretStream = await kubeclient.api.v1.watch.namespace(namespace).secrets.getObjectStream();
    secretStream.on('data', event => {
      if (event.object && event.object.metadata.name.endsWith(KEYCLOAK_SECRET_SUFFIX)) {
        updateAll(namespace, kubeclient);
      }
    });

    const configmapStream = await kubeclient.api.v1.watch.namespace(namespace).configmaps.getObjectStream();
    configmapStream.on('data', event => {
      if (event.object && event.object.metadata.name.endsWith(DATASYNC_CONFIGMAP_SUFFIX)) {
        updateAll(namespace, kubeclient);
      }
    });

    const mssConfigMapStream = await kubeclient.api.v1.watch.namespace(namespace).configmaps.getObjectStream();
    mssConfigMapStream.on('data', event => {
      if (event.object && event.object.metadata.name.endsWith(MOBILE_SECURITY_SUFFIX)) {
        updateAll(namespace, kubeclient);
      }
    });

    watchAndroidVariantStream(namespace, kubeclient);
    watchIosVariantStream(namespace, kubeclient);
  });
}

/**
 * Watch for updates to the MobileClient custom resource.
 * @param {String} namespace - The namespace to watch
 * @param {*} kubeclient - kubernetes client
 */
async function watchMobileClients(namespace, kubeclient) {
  const appStream = await kubeclient.apis[mobileClientCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .mobileclients.getObjectStream();
  appStream.on('data', event => {
    if (event.type === 'ADDED') {
      updateAll(namespace, kubeclient);
    }
  });

  // === WORKAROUND ===
  // The stream automatically closes when watching CRDs after an inconsistent amount of time.
  // Listen for when the stream ends and reopen it.
  appStream.on('end', () => {
    watchMobileClients(namespace, kubeclient);
  });
}

/**
 * Watch for updates to the AndroidVariant custom resource.
 * @param {String} namespace - The namespace to watch
 * @param {*} kubeclient - kubernetes client
 */
async function watchAndroidVariantStream(namespace, kubeclient) {
  const androidVariantStream = await kubeclient.apis[androidVariantCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .androidvariants.getObjectStream();
  androidVariantStream.on('data', event => {
    if (event.object && event.object.status && !updating) {
      updateAll(namespace, kubeclient);
    }
  });

  // === WORKAROUND ===
  // The stream automatically closes when watching CRDs after an inconsistent amount of time.
  // Listen for when the stream ends and reopen it.
  androidVariantStream.on('end', () => {
    watchAndroidVariantStream(namespace, kubeclient);
  });
}

/**
 * Watch for updates to the IOSVariant custom resource.
 * @param {String} namespace - The namespace to watch
 * @param {*} kubeclient - kubernetes client
 */
async function watchIosVariantStream(namespace, kubeclient) {
  const iosVariantStream = await kubeclient.apis[iosVariantCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .iosvariants.getObjectStream();
  iosVariantStream.on('data', event => {
    if (event.object && event.object.status && !updating) {
      updateAll(namespace, kubeclient);
    }
  });

  // === WORKAROUND ===
  // The stream automatically closes when watching CRDs after an inconsistent amount of time.
  // Listen for when the stream ends and reopen it.
  iosVariantStream.on('end', () => {
    watchIosVariantStream(namespace, kubeclient);
  });
}

module.exports = {
  updateAppsAndWatch
};
