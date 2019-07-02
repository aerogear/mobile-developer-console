const equal = require('fast-deep-equal');
const JSONStream = require('json-stream');
const mobileClientCRD = require('./mobile-client-crd.json');
const mobileSecurityServiceCRD = require('./mobile-security-service-crd.json');
const {
  PushService,
  IdentityManagementService,
  MetricsService,
  DataSyncService,
  MobileSecurityService
} = require('./mobile-services-info');

const services = [PushService, IdentityManagementService, MetricsService, DataSyncService, MobileSecurityService];

const KEYCLOAK_SECRET_SUFFIX = '-install-config';
const DATASYNC_CONFIGMAP_SUFFIX = '-data-sync-binding';
const MOBILE_SECURITY_SUFFIX = '-security';

function updateAll(namespace, kubeclient) {
  console.log('Check services for all apps');
  return kubeclient.apis[mobileClientCRD.spec.group].v1alpha1
    .namespace(namespace)
    .mobileclients.get()
    .then(resp => resp.body)
    .then(mobileclientList => mobileclientList.items)
    .then(mobileclients => mobileclients.map(mobileclient => updateApp(namespace, mobileclient, kubeclient)))
    .then(promises => Promise.all(promises))
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
  const promises = services.map(service =>
    service.getClientConfig(service.bindCustomResource.namespace || namespace, appName, kubeclient)
  );
  return Promise.all(promises).then(serviceConfigs => serviceConfigs.filter(Boolean));
}

function updateAppsAndWatch(namespace, kubeclient) {
  updateAll(namespace, kubeclient).then(() => {
    const appStream = kubeclient.apis[mobileClientCRD.spec.group].v1alpha1.watch
      .namespace(namespace)
      .mobileclients.getStream();
    const appJsonStream = new JSONStream();
    appStream.pipe(appJsonStream);
    appJsonStream.on('data', event => {
      if (event.type === 'ADDED') {
        updateAll(namespace, kubeclient);
      }
    });

    const secretStream = kubeclient.api.v1.watch.namespace(namespace).secrets.getStream();
    const secretsJsonStream = new JSONStream();
    secretStream.pipe(secretsJsonStream);
    secretsJsonStream.on('data', event => {
      if (event.object && event.object.metadata.name.endsWith(KEYCLOAK_SECRET_SUFFIX)) {
        updateAll(namespace, kubeclient);
      }
    });

    const configmapStream = kubeclient.api.v1.watch.namespace(namespace).configmaps.getStream();
    const configmapJsonStream = new JSONStream();
    configmapStream.pipe(configmapJsonStream);
    configmapJsonStream.on('data', event => {
      if (event.object && event.object.metadata.name.endsWith(DATASYNC_CONFIGMAP_SUFFIX)) {
        updateAll(namespace, kubeclient);
      }
    });

    const mssConfigMapStream = kubeclient.api.v1.watch.namespace('mobile-security-service-apps').configmaps.getStream();
    const mssConfigMapJsonStream = new JSONStream();
    mssConfigMapStream.pipe(mssConfigMapJsonStream);
    mssConfigMapJsonStream.on('data', event => {
      if (event.object && event.object.metadata.name.endsWith(MOBILE_SECURITY_SUFFIX)) {
        updateAll(namespace, kubeclient);
      }
    });
  });
}

/**
 * Watch the namespace for the Mobile Security Service.
 * When the namespace is created then start watching changes
 * to the MobileSecurityService custom resource
 *
 * @param {String} namespace - The managed namespace of the Mobile Security Service
 * @param {*} kubeclient - The kubernetes API client
 */
function watchMobileSecurityService(namespace, kubeclient) {
  const stream = kubeclient.api.v1.watch.namespace(namespace).getStream();
  const jsonStream = new JSONStream();
  stream.pipe(jsonStream);
  jsonStream.on('data', event => {
    if (event.type === 'ADDED') {
      watchMobileSecurityServiceCR(namespace, kubeclient);
    }
  });
}

/**
 * Watch for changes to the MobileSecurityService custom resource.
 *
 * @param {String} namespace - The managed namespace of the Mobile Security Service
 * @param {*} kubeclient - The kubernetes API client
 */
function watchMobileSecurityServiceCR(namespace, kubeclient) {
  const stream = kubeclient.apis[mobileSecurityServiceCRD.spec.group].v1alpha1.watch
    .namespace(namespace)
    .mobilesecurityservices()
    .getStream();

  const jsonStream = new JSONStream();
  stream.pipe(jsonStream);

  jsonStream.on('data', event => {
    if (event.type === 'ADDED') {
      MobileSecurityService.disabled = false;
    } else if (event.type === 'DELETED') {
      MobileSecurityService.disabled = true;
    }
  });
}

module.exports = {
  updateAppsAndWatch,
  watchMobileSecurityService
};
