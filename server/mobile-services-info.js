const PUSH_SERVIE_TYPE = 'push';
const IDM_SERVICE_TYPE = 'keycloak';
const METRICS_SERVICE_TYPE = 'metrics';

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
  }
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
  getClientConfig: (appname, kubeclient) => {
    
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
  }
};

const MobileServicesMap = {
  [PUSH_SERVIE_TYPE]: PushService,
  [IDM_SERVICE_TYPE]: IdentityManagementService,
  [METRICS_SERVICE_TYPE]: MetricsService
};

module.exports = { MobileServicesMap, PushService, IdentityManagementService, MetricsService };
