const url = require('url');
const fs = require('fs');

const { addProtocolIfMissing } = require('./helpers');

const pushApplicationCRD = require('./push-application-crd.json');
const androidVariantCRD = require('./android-variant-crd.json');
const iosVariantCRD = require('./ios-variant-crd.json');

const PUSH_SERVICE_TYPE = 'push';
const IDM_SERVICE_TYPE = 'keycloak';
const METRICS_SERVICE_TYPE = 'metrics';
const DATA_SYNC_TYPE = 'sync-app';
const MOBILE_SECURITY_TYPE = 'security';
const ANDROID_VARIANT_TYPE = 'android';
const IOS_VARIANT_TYPE = 'ios';

const IOS_VARIANT_KIND = 'IOSVariant';
const ANDROID_VARIANT_KIND = 'AndroidVariant';

const IOS_UPS_SUFFIX = '-ios-ups-variant';
const ANDROID_UPS_SUFFIX = '-android-ups-variant';

const configPath = process.env.MOBILE_SERVICES_CONFIG_FILE || '/etc/mdc/servicesConfig.json';
const { UPS_DOCUMENTATION_URL, IDM_DOCUMENTATION_URL, MSS_DOCUMENTATION_URL, SYNC_DOCUMENTATION_URL } = process.env;

function decodeBase64(encoded) {
  const buff = Buffer.from(encoded, 'base64');
  return buff.toString('utf8');
}

const PushService = {
  type: PUSH_SERVICE_TYPE,
  name: 'Push Notification',
  icon: '/img/push.svg',
  description: 'Unified Push Server',
  documentationUrl: UPS_DOCUMENTATION_URL,
  bindCustomResource: {
    name: 'pushapplications',
    version: 'v1alpha1',
    group: 'push.aerogear.org',
    kind: 'pushapplications',
    variants: [
      {
        name: 'androidvariants',
        version: 'v1alpha1',
        group: 'push.aerogear.org',
        kind: 'AndroidVariant'
      },
      {
        name: 'iosvariants',
        version: 'v1alpha1',
        group: 'push.aerogear.org',
        kind: 'IOSVariant'
      }
    ]
  },
  getClientConfig: (namespace, appname, kubeclient) => {
    // get the android variant associated with this app
    const getAndroidVariant = kubeclient.apis[androidVariantCRD.spec.group].v1alpha1
      .namespace(namespace)
      .androidvariants(`${appname}${ANDROID_UPS_SUFFIX}`)
      .get()
      .then(resp => resp.body)
      .catch(err => {
        const name = `${appname}${ANDROID_UPS_SUFFIX}`;
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find AndroidVariant ${name}`);
        } else {
          console.warn(`Error when fetch AndroidVariant ${name}`, err);
        }
      });

    // get the iOS variant associated with this app
    const getIOSVariant = kubeclient.apis[iosVariantCRD.spec.group].v1alpha1
      .namespace(namespace)
      .iosvariants(`${appname}${IOS_UPS_SUFFIX}`)
      .get()
      .then(resp => resp.body)
      .catch(err => {
        const name = `${appname}${IOS_UPS_SUFFIX}`;
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find IOSVariant ${name}`);
        } else {
          console.warn(`Error when fetch IOSVariant ${name}`, err);
        }
      });

    return kubeclient.apis[pushApplicationCRD.spec.group].v1alpha1
      .namespace(namespace)
      .pushapplications(appname)
      .get()
      .then(resp => resp.body)
      .then(pushApplication => ({
        id: pushApplication.metadata.uid,
        name: PUSH_SERVICE_TYPE,
        type: PUSH_SERVICE_TYPE,
        config: {}
      }))
      .then(push =>
        getServices(configPath).then(services => {
          const pushService = services.find(s => s.type === PUSH_SERVICE_TYPE);
          return {
            ...push,
            url: pushService.host
          };
        })
      )
      .then(push =>
        Promise.all([getAndroidVariant, getIOSVariant])
          .then(variants => variants.filter(Boolean))
          .then(variants => {
            if (!variants || !variants.length) {
              return null;
            }

            // get the AndroidVariant and add it
            const androidVariant = variants.find(v => !!v && v.kind === ANDROID_VARIANT_KIND);
            if (androidVariant && androidVariant.status) {
              push.config[ANDROID_VARIANT_TYPE] = {
                variantSecret: androidVariant.status.secret,
                variantId: androidVariant.status.variantId
              };
            }

            // get the IOSVariant and add it
            const iosVariant = variants.find(v => !!v && v.kind === IOS_VARIANT_KIND);
            if (iosVariant && iosVariant.status) {
              push.config[IOS_VARIANT_TYPE] = {
                variantSecret: iosVariant.status.secret,
                variantId: iosVariant.status.variantId
              };
            }

            return push;
          })
      )
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find PushApplication ${appname}`);
        } else {
          console.warn(`Error when fetch PushApplication ${appname}`, err);
        }
        return null;
      });
  }
};

const IdentityManagementService = {
  type: IDM_SERVICE_TYPE,
  name: 'Identity Management',
  icon: '/img/keycloak.svg',
  description: 'Identity Management Service',
  documentationUrl: IDM_DOCUMENTATION_URL,
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
            name: IDM_SERVICE_TYPE,
            type: IDM_SERVICE_TYPE,
            url: config['auth-server-url'],
            config
          };
        }
        return null;
      })
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find secret ${secretName}`);
        } else {
          console.warn(`Error when fetch secret ${secretName}`, err);
        }
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
  description: 'Data Sync Service',
  documentationUrl: SYNC_DOCUMENTATION_URL,
  bindCustomResource: {
    name: 'configmaps',
    version: 'v1',
    kind: 'ConfigMap'
  },
  getClientConfig: (namespace, appname, kubeclient) => {
    const configmapName = `${appname}-data-sync-binding`;
    return kubeclient.api.v1
      .namespaces(namespace)
      .configmaps(configmapName)
      .get()
      .then(resp => resp.body)
      .then(configmap => {
        if (configmap) {
          const serverUrl = url.parse(configmap.data.syncServerUrl);
          serverUrl.pathname = configmap.data.graphqlEndpoint;
          const httpUrl = url.format(serverUrl);
          serverUrl.protocol = 'wss';
          const websocketUrl = url.format(serverUrl);
          return {
            id: configmap.metadata.uid,
            name: DATA_SYNC_TYPE,
            type: DATA_SYNC_TYPE,
            url: httpUrl,
            config: {
              websocketUrl
            }
          };
        }
        return null;
      })
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find configmap ${configmapName}`);
        } else {
          console.warn(`Error when fetch configmap ${configmapName}`, err);
        }
        return null;
      });
  }
};

const MobileSecurityService = {
  type: MOBILE_SECURITY_TYPE,
  name: 'Mobile Security',
  icon: '/img/security.svg',
  description: 'Mobile Security Service',
  documentationUrl: MSS_DOCUMENTATION_URL,
  bindCustomResource: {
    name: 'mobilesecurityserviceapps',
    version: 'v1alpha1',
    group: 'mobile-security-service.aerogear.org',
    kind: 'MobileSecurityServiceApp'
  },
  getClientConfig: (namespace, appname, kubeclient) => {
    const configmapName = `${appname}-security`;

    return kubeclient.api.v1
      .namespaces(namespace)
      .configmaps(configmapName)
      .get()
      .then(resp => resp.body)
      .then(configmap => {
        if (configmap) {
          const sdkConfig = JSON.parse(configmap.data.SDKConfig);
          const sdkConfigUrl = sdkConfig.url;
          return {
            id: configmap.metadata.uid,
            name: MOBILE_SECURITY_TYPE,
            type: MOBILE_SECURITY_TYPE,
            url: sdkConfigUrl
          };
        }
        return null;
      })
      .catch(err => {
        if (err && err.statusCode && err.statusCode === 404) {
          console.info(`Can not find configmap ${configmapName}`);
        } else {
          console.warn(`Error when fetch configmap ${configmapName}`, err);
        }
        return null;
      });
  }
};

const MobileServicesMap = {
  [PUSH_SERVICE_TYPE]: PushService,
  [IDM_SERVICE_TYPE]: IdentityManagementService,
  [METRICS_SERVICE_TYPE]: MetricsService,
  [DATA_SYNC_TYPE]: DataSyncService,
  [MOBILE_SECURITY_TYPE]: MobileSecurityService
};

const dataSyncService = {
  type: DataSyncService.type,
  mobile: true
};

const DEFAULT_SERVICES = {
  version: 'dev',
  components: [
    {
      type: IdentityManagementService.type,
      version: 'latest',
      host: addProtocolIfMissing(`${process.env.IDM_URL || process.env.OPENSHIFT_HOST}`),
      mobile: true
    },
    {
      type: PushService.type,
      host: addProtocolIfMissing(`${process.env.UPS_URL || process.env.OPENSHIFT_HOST}`),
      version: 'latest',
      mobile: true
    },
    // {
    //   type: MetricsService.type,
    //   url: `https://${process.env.METRICS_URL || process.env.OPENSHIFT_HOST}`
    // }
    {
      type: MobileSecurityService.type,
      host: addProtocolIfMissing(`${process.env.MSS_URL || process.env.OPENSHIFT_HOST}`),
      version: 'latest',
      mobile: true
    }
  ]
};

/**
 * Get the mobile services that are provisioned and available to be used by MDC
 *
 * @returns {Object} the available mobile services
 */
function getServices() {
  return new Promise(resolve => {
    if (fs.existsSync(configPath)) {
      return fs.readFile(configPath, (err, data) => {
        if (err) {
          console.error(`Failed to read service config file ${configPath}, mock data will be used`);
          return resolve(DEFAULT_SERVICES);
        }
        return resolve(JSON.parse(data));
      });
    }
    console.warn(`can not find service config file at ${configPath}, mock data will be used`);
    return resolve(DEFAULT_SERVICES);
  })
    .then(servicesUrls => servicesUrls.components.concat([dataSyncService]))
    .then(services => services.filter(s => s.mobile))
    .then(services =>
      services.map(service => {
        const serviceInfo = MobileServicesMap[service.type];
        if (serviceInfo) {
          return { ...serviceInfo, ...service };
        }
        return service;
      })
    );
}

module.exports = {
  MobileServicesMap,
  PushService,
  IdentityManagementService,
  DataSyncService,
  MetricsService,
  MobileSecurityService,
  getServices
};
