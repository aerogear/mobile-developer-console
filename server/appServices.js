const equal = require('fast-deep-equal');
const mobileClientCRD = require('./mobile-client-crd.json');
const androidVariantCRD = require('./android-variant-crd.json');
const iosVariantCRD = require('./ios-variant-crd.json');
const mobileSecurityServiceCRD = require('./mobile-security-crd.json');
const { debounce } = require('lodash');
const _ = require('lodash');
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
const ANDROID_UPS_SUFFIX = '-android-ups-variant';
const IOS_UPS_SUFFIX = '-ios-ups-variant';

const { MAX_RETRIES = 60, RETRY_TIMEOUT = 5000 } = process.env;

const { logAction, getAppName, getApp } = require('./helpers');

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

let appCollect = []; // created to hold a list of apps, this gets cleared from time to time
let appNames = []; // Hold a list of the app names used as a refernces

function updateAll(namespace, kubeclient) {
  updating = true;
  console.log('\x1b[31mCheck services for all apps', Date()); // Add a red marker to the log files
  return kubeclient.apis[mobileClientCRD.spec.group].v1alpha1
    .namespace(namespace)
    .mobileclient.get() // This call returns once for every app that has been created
    .then(resp => resp.body)
    .then(mobileclientList => {
      if (updating) {
        mobileclientList.items.forEach(element => {
          if (!_.includes(appNames, element.metadata.name)) {
            appCollect.push(element); // only getting one copy of an app for updating
            appNames.push(element.metadata.name);
            logAction(`check value = ${!_.includes(appNames, element.metadata.name)}`);
          }
        });
        logAction(`Mobile Apps (appCollect): len ${appCollect.length}`);
        updating = false;
      }
      return appCollect;
    })
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
  logAction('At the start of the upadateApp()');
  const oldServices = app.status.services;
  const appName = app.metadata.name;
  return getServicesForApp(namespace, app, kubeclient)
    .then(newServices => [!equal(newServices, oldServices), newServices])
    .then(result => {
      const shouldUpdate = result[0];
      if (shouldUpdate) {
        logAction(`App ${appName} should be updated`);
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
  logAction('About to call updateAll()');
  updateAll(namespace, kubeclient).then(pickles => {
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
  logAction('Watching for new Mobile Clients');
  const appStream = await kubeclient.apis[mobileClientCRD.spec.group].v1alpha1.watch
    .namespaces(namespace)
    .mobileclients.getObjectStream();

  appStream.on('data', event => {
    if (event.type === 'ADDED' && !_.includes(appNames, event.object.metadata.name)) {
      updateAll(namespace, kubeclient);
    } else if (event.type === 'DELETED') {
      appNames = _.remove(appNames, event.object.metadata.name);
      appCollect = [];
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
    handleEventData(event, DATASYNC_CONFIGMAP_SUFFIX, namespace, kubeclient);
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
    logAction('Data stream from android');
    handleUPSEventData(event, ANDROID_UPS_SUFFIX, namespace, kubeclient);
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
    logAction('Data stream from IoS');
    handleUPSEventData(event, IOS_UPS_SUFFIX, namespace, kubeclient);
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
    logAction('MSS data received');
    handleEventData(event, MOBILE_SECURITY_SUFFIX, namespace, kubeclient);
  });

  // reopens the stream when it closes
  mssAppStream.on('end', () => {
    watchMobileSecurityApps(namespace, kubeclient);
  });

  mssAppStream.on('close', () => {
    retryWatchDebounce(namespace, kubeclient);
  });
}

function handleUPSEventData(event, suffix, namespace, kubeclient) {
  if (event.type === 'ADDED' && event.object && event.object.metadata.name.endsWith(suffix) && !updating) {
    const data = getApp(appCollect, getAppName(event));

    const currentServices = data.status.services.filter(ser => ser.name === 'push');
    const service = currentServices[0];

    if (event.object.kind === 'AndroidVariant') {
      if (service && service.config && typeof service.config.android !== 'undefined') {
        console.log('AndroidVariant existing, no action required');
      } else {
        logAction('Adding a AndroidVariant to apps');
        fullAppRefresh(namespace, kubeclient);
      }
    } else if (event.object.kind === 'IOSVariant') {
      if (service && service.config && typeof service.config.ios !== 'undefined') {
        console.log('IOSVariant existing, no action required');
      } else {
        logAction('Adding a IOSVariant to apps');
        fullAppRefresh(namespace, kubeclient);
      }
    }
  } else if (event.type === 'DELETED') {
    fullAppRefresh(namespace, kubeclient);
  }
}

function fullAppRefresh(namespace, kubeclient) {
  // Clear out the collections and update all apps again
  appCollect = [];
  appNames = [];
  updateAll(namespace, kubeclient);
}

function handleEventData(event, suffix, namespace, kubeclient) {
  if (event.type === 'ADDED' && event.object && event.object.metadata.name.endsWith(suffix) && !updating) {
    eventAction(event, namespace, kubeclient);
  } else if (event.type === 'DELETED') {
    appCollect = [];
    appNames = [];
    updateAll(namespace, kubeclient);
  }
}

function eventAction(event, namespace, kubeclient) {
  try {
    updating = true;
    const appName = getAppName(event);
    const data = getApp(appCollect, appName);
    logAction(`Starting update of App : ${appName}`);
    updateApp(namespace, data, kubeclient);
  } catch (err) {
    console.log(err);
  } finally {
    updating = false;
  }
}

module.exports = {
  updateAppsAndWatch
};
