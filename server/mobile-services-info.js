const PUSH_SERVIE_TYPE = 'push';
const IDM_SERVICE_TYPE = 'keycloak';
const METRICS_SERVICE_TYPE = 'metrics';
const DATA_SYNC_TYPE = 'sync-app';

function decodeBase64(encoded) {
  const buff = Buffer.from(encoded, 'base64');
  return buff.toString('utf8');
}

const PushService = {
  type: PUSH_SERVIE_TYPE,
  name: 'Push Notification',
  icon: '/img/push.svg',
  description: 'Unified Push Server',
  bindCustomResource: {
    name: 'pushvariants',
    version: 'v1alpha1',
    group: 'aerogear.org',
    kind: 'PushVariant'
  },
  getClientConfig: (namespace, appname, kubeclient) =>
    // TODO: implement me!
    null
};

const IdentityManagementService = {
  type: IDM_SERVICE_TYPE,
  name: 'Identity Management',
  icon: '/img/keycloak.svg',
  description: 'Identity Management Service',
  bindCustomResource: {
    name: 'keycloakrealms',
    version: 'v1alpha1',
    group: 'aerogear.org',
    kind: 'KeycloakRealm'
  },
  getClientConfig: (namespace, appname, kubeclient) => {
    const secretName = `${appname}-client-install-config`;
    return kubeclient.api.v1
      .namespaces(namespace)
      .secrets(secretName)
      .get()
      .then(resp => resp.body)
      .then(secret => {
        if (secret) {
          const encodedInstall = secret.data.install;
          const config = JSON.parse(decodeBase64(encodedInstall));
          return {
            id: secret.metadata.uid,
            name: 'keycloak',
            type: IDM_SERVICE_TYPE,
            url: config['auth-server-url'],
            config
          };
        }
        return null;
      })
      .catch(err => {
        console.warn(`Error when fetch secret ${secretName}`, err);
        return null;
      });
  }
};

const MetricsService = {
  type: METRICS_SERVICE_TYPE,
  name: 'Mobile App Metrics',
  icon: '/img/metrics.svg',
  description: 'Mobile App Metrics Service',
  bindCustomResource: {
    name: 'metricsapps',
    version: 'v1alpha1',
    group: 'aerogear.org',
    kind: 'MetricsApp'
  },
  getClientConfig: (namespace, appname, kubeclient) =>
    // TODO: implement me!
    null
};

const DataSyncService = {
  type: DATA_SYNC_TYPE,
  name: 'Data Sync',
  icon: '/img/sync.svg',
  description: 'Data Sync',
  getClientConfig: (namespace, appname, kubeclient) =>
    // TODO: implement me!
    null
};

const MobileServicesMap = {
  [PUSH_SERVIE_TYPE]: PushService,
  [IDM_SERVICE_TYPE]: IdentityManagementService,
  [METRICS_SERVICE_TYPE]: MetricsService,
  [DATA_SYNC_TYPE]: DataSyncService
};

module.exports = { MobileServicesMap, PushService, IdentityManagementService, DataSyncService, MetricsService };
