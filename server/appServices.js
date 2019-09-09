const equal = require('fast-deep-equal');
const mobileClientCRD = require('./mobile-client-crd.json');
const androidVariantCRD = require('./android-variant-crd.json');
const iosVariantCRD = require('./ios-variant-crd.json');
const mobileSecurityServiceCRD = require('./mobile-security-crd.json');
const { debounce } = require('lodash');
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

const { MAX_RETRIES = 60, RETRY_TIMEOUT = 5000 } = process.env;

let updating = false;
// keeps track of how many attempts were made to connect to the Kubernetes API server
let connectionAttempts = 0;
const debounceTime = 250;
// create a debounce function for the if a connection to
// the kubernetes API fails. this will ensure that only one connection
// retry attempt will take place at a time.
const retryWatchDebounce = debounce((namespace, kubeclient) => {
  retryWatch(namespace, kubeclient);
}, debounceTime);

function updateAll(namespace, kubeclient) {
  updating = true;
  console.log('Check services for all apps', Date());
  return kubeclient.apis[mobileClientCRD.spec.group].v1alpha1
    .namespace(namespace)
    .mobileclients.get()
    .then(resp => resp.body)
    .then(mobileclientList => mobileclientList.items)
    .then(mobileclients => mobileclients.map(mobileclient => updateApp(namespace, mobileclient, kubeclient)))
    .then(promises => {
      updating = false;
      return Promise.all(promises);
    })
    .catch(err => {
      console.error(`Failed to update apps due to error`, err);

      retryWatchDebounce(namespace, kubeclient);

      throw err;
    });
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
    .catch(err => {
      console.error(`Failed to update app ${app.metadata.name} due to error`, err);

      retryWatchDebounce();

      throw err;
    });
}

function getServicesForApp(namespace, app, kubeclient) {
  const appName = app.metadata.name;
  const promises = services.map(service => service.getClientConfig(namespace, appName, kubeclient));
  return Promise.all(promises).then(serviceConfigs => serviceConfigs.filter(Boolean));
}

async function updateAppsAndWatch(namespace, kubeclient) {
  connectionAttempts++;
  updateAll(namespace, kubeclient).then(() => {
    watchMobileClients(namespace, kubeclient);
    watchDataSyncConfigMaps(namespace, kubeclient);
    watchKeyCloakSecrets(namespace, kubeclient);
    watchAndroidVariants(namespace, kubeclient);
    watchIosVariants(namespace, kubeclient);
    watchMobileSecurityApps(namespace, kubeclient);
    // reset connection attempts count
    connectionAttempts = 1;
  });
}

/**
 * Watch for updates to the MobileClient custom resource and update all apps.
 *
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

  // reopens the stream when it closes
  appStream.on('end', () => {
    watchMobileClients(namespace, kubeclient);
  });

  appStream.on('close', () => {
    retryWatchDebounce(namespace, kubeclient);
  });
}

/**
 * Watch for changes to Data sync config maps and update all apps.
 *
 * @param {String} namespace - The namespace to watch the config maps in
 * @param {*} kubeclient - The kubernetes-client
 */
async function watchDataSyncConfigMaps(namespace, kubeclient) {
  const configmapStream = await kubeclient.api.v1.watch.namespace(namespace).configmaps.getObjectStream();
  configmapStream.on('data', event => {
    if (event.object && event.object.metadata.name.endsWith(DATASYNC_CONFIGMAP_SUFFIX)) {
      updateAll(namespace, kubeclient);
    }
  });

  // reopens the stream when it closes
  configmapStream.on('end', () => {
    watchDataSyncConfigMaps(namespace, kubeclient);
  });

  configmapStream.on('close', () => {
    retryWatchDebounce(namespace, kubeclient);
  });
}

/**
 * Watch for changes to Keycloak secrets and update all apps.
 *
 * @param {String} namespace - The namespace to watch the secrets in
 * @param {*} kubeclient - The kubernetes-client
 */
async function watchKeyCloakSecrets(namespace, kubeclient) {
  const secretStream = await kubeclient.api.v1.watch.namespace(namespace).secrets.getObjectStream();
  secretStream.on('data', event => {
    if (event.object && event.object.metadata.name.endsWith(KEYCLOAK_SECRET_SUFFIX)) {
      updateAll(namespace, kubeclient);
    }
  });

  // reopens the stream when it closes
  secretStream.on('end', () => {
    watchKeyCloakSecrets(namespace, kubeclient);
  });

  secretStream.on('close', () => {
    retryWatchDebounce(namespace, kubeclient);
  });
}

/**
 * When the Kubernetes API is restarted, set a timeout and try to set up the watches after the API is up again.
 *
 * @param {String} namespace
 * @param {*} kubeclient
 */
function retryWatch(namespace, kubeclient) {
  if (connectionAttempts < MAX_RETRIES) {
    console.log(
      `waiting ${RETRY_TIMEOUT} milliseconds before attempting services watches again`,
      `attempt ${connectionAttempts} of ${MAX_RETRIES}`
    );

    setTimeout(() => {
      updateAppsAndWatch(namespace, kubeclient);
    }, RETRY_TIMEOUT);
  } else {
    console.log(`Failed to set up watch ${MAX_RETRIES} times, exiting application`);
    process.exit(1);
  }
}

/**
 * Watch for updates to the AndroidVariant custom resource and update all apps.
 *
 * @param {String} namespace - The namespace to watch
 * @param {*} kubeclient - kubernetes client
 */
async function watchAndroidVariants(namespace, kubeclient) {
  const androidVariantStream = await kubeclient.apis[androidVariantCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .androidvariants.getObjectStream();

  androidVariantStream.on('data', event => {
    if (event.object && event.object.status && !updating) {
      updateAll(namespace, kubeclient);
    }
  });

  // reopens the stream when it closes
  androidVariantStream.on('end', () => {
    watchAndroidVariants(namespace, kubeclient);
  });

  androidVariantStream.on('close', () => {
    retryWatchDebounce();
  });
}

/**
 * Watch for updates to the IOSVariant custom resource and update all apps.
 *
 * @param {String} namespace - The namespace to watch
 * @param {*} kubeclient - kubernetes client
 */
async function watchIosVariants(namespace, kubeclient) {
  const iosVariantStream = await kubeclient.apis[iosVariantCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .iosvariants.getObjectStream();

  iosVariantStream.on('data', event => {
    if (event.object && event.object.status && !updating) {
      updateAll(namespace, kubeclient);
    }
  });

  // reopens the stream when it closes
  iosVariantStream.on('end', () => {
    watchIosVariants(namespace, kubeclient);
  });

  iosVariantStream.on('close', () => {
    retryWatchDebounce(namespace, kubeclient);
  });
}

/**
 * Watch for updates to the MobileSecurityServiceApp custom resources and update all apps.
 *
 * @param {String} namespace - The namespace to watch
 * @param {*} kubeclient - kubernetes client
 */
async function watchMobileSecurityApps(namespace, kubeclient) {
  const mssAppStream = await kubeclient.apis[mobileSecurityServiceCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .mobilesecurityserviceapps.getObjectStream();

  mssAppStream.on('data', event => {
    if (event.object && event.object.metadata.name.endsWith(MOBILE_SECURITY_SUFFIX) && !updating) {
      updateAll(namespace, kubeclient);
    }
  });

  // reopens the stream when it closes
  mssAppStream.on('end', () => {
    watchMobileSecurityApps(namespace, kubeclient);
  });

  mssAppStream.on('close', () => {
    retryWatchDebounce(namespace, kubeclient);
  });
}

module.exports = {
  updateAppsAndWatch
};
