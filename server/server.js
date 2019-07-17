const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const promMid = require('express-prometheus-middleware');
const { Client } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');
const packageJson = require('../package.json');
const fs = require('fs');
const { URL } = require('url');
const {
  IdentityManagementService,
  DataSyncService,
  MobileServicesMap,
  MobileSecurityService,
  PushService
} = require('./mobile-services-info');
const { updateAppsAndWatch } = require('./appServices');
const mobileClientCRD = require('./mobile-client-crd.json');
const pushApplicationCRD = require('./push-application-crd.json');
const androidVariantCRD = require('./android-variant-crd.json');
const iosVariantCRD = require('./ios-variant-crd.json');

const app = express();

app.use(bodyParser.json());

// prometheus metrics endpoint
app.use(
  promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5]
  })
);

const port = process.env.PORT || 4000;
const configPath = process.env.MOBILE_SERVICES_CONFIG_FILE || '/etc/mdc/servicesConfig.json';
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
      host: `https://${process.env.IDM_URL || process.env.OPENSHIFT_HOST}`,
      mobile: true
    },
    {
      type: PushService.type,
      host: `https://${process.env.UPS_URL || process.env.OPENSHIFT_HOST}`,
      version: 'latest',
      mobile: true
    },
    // {
    //   type: MetricsService.type,
    //   url: `https://${process.env.METRICS_URL || process.env.OPENSHIFT_HOST}`
    // }
    {
      type: MobileSecurityService.type,
      host: `https://${process.env.MSS_URL || process.env.OPENSHIFT_HOST}`,
      version: 'latest',
      mobile: true
    }
  ]
};

const DEFAULT_NAMESPACE = 'mobile-console';

// Dynamic configuration for openshift API calls
app.get('/api/server_config.js', (req, res) => {
  res.send(getConfigData(req));
});

app.get('/api/mobileservices', (req, res) => {
  getServices(configPath).then(servicesJson => {
    res.json({
      items: servicesJson
    });
  });
});

app.get('/about', (_, res) => {
  res.json({
    version: packageJson.version || 'Not Available'
  });
});

function getConfigData(req) {
  const {
    OPENSHIFT_USER_TOKEN,
    OPENSHIFT_USER_NAME,
    OPENSHIFT_USER_EMAIL,
    NAMESPACE,
    MSS_NAMESPACE,
    MSS_APPS_NAMESPACE,
    ENABLE_BUILD_TAB,
    DOCS_PREFIX
  } = process.env;
  let userToken = OPENSHIFT_USER_TOKEN;
  let userName = OPENSHIFT_USER_NAME || 'testuser';
  let userEmail = OPENSHIFT_USER_EMAIL || 'testuser@localhost';
  const mdcNamespace = NAMESPACE || DEFAULT_NAMESPACE;
  const mssNamespace = MSS_NAMESPACE || false;
  const mssAppsNamespace = MSS_APPS_NAMESPACE || MSS_NAMESPACE;
  const docsPrefix = DOCS_PREFIX || 'https://docs.aerogear.org/aerogear/latest';
  let enableBuildTab = false;
  if (ENABLE_BUILD_TAB && ENABLE_BUILD_TAB === 'true') {
    enableBuildTab = true;
  }

  if (process.env.NODE_ENV === 'production') {
    userToken = req.get('X-Forwarded-Access-Token');
    userName = req.get('X-Forwarded-User');
    userEmail = req.get('X-Forwarded-Email');
  }
  const parsedHost = new URL(process.env.OPENSHIFT_HOST);
  if (!parsedHost.protocol) {
    parsedHost.protocol = 'https';
  }
  const masterUri = parsedHost.toString().slice(0, -1);
  parsedHost.protocol = 'wss';
  const wssMasterUri = parsedHost.toString().slice(0, -1);

  return `window.OPENSHIFT_CONFIG = {
    mdcNamespace: '${mdcNamespace}',
    mss: {
      namespace: '${mssNamespace}',
      appsNamespace: '${mssAppsNamespace}'
    },
    masterUri: '${masterUri}',
    wssMasterUri: '${wssMasterUri}',
    user: {
      accessToken: '${userToken}',
      name: '${userName}',
      email: '${userEmail}'
    }
  }; window.SERVER_DATA= { ENABLE_BUILD_TAB: ${enableBuildTab}, DOCS_PREFIX: '${docsPrefix}' };`;
}

function getServices(servicesConfigPath) {
  return new Promise(resolve => {
    if (fs.existsSync(servicesConfigPath)) {
      fs.readFile(servicesConfigPath, (err, data) => {
        if (err) {
          console.error(`Failed to read service config file ${servicesConfigPath}, mock data will be used`);
          return resolve(DEFAULT_SERVICES);
        }
        return resolve(JSON.parse(data));
      });
    }
    console.warn(`can not find service config file at ${servicesConfigPath}, mock data will be used`);
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

async function initKubeClient() {
  try {
    const conf =
      process.env.NODE_ENV === 'production' ? Request.config.getInCluster() : Request.config.fromKubeconfig();
    const backend = new Request(conf);

    if (process.env.INSECURE_SERVER) {
      backend.requestOptions.strictSSL = false;
    }

    const kubeclient = new Client({ backend });
    await kubeclient.loadSpec();
    kubeclient.addCustomResourceDefinition(mobileClientCRD);
    kubeclient.addCustomResourceDefinition(pushApplicationCRD);
    kubeclient.addCustomResourceDefinition(androidVariantCRD);
    kubeclient.addCustomResourceDefinition(iosVariantCRD);
    return kubeclient;
  } catch (e) {
    console.error('Failed to init kube client', e);
    return null;
  }
}

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '..', 'build')));
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
  });
}

async function run() {
  const { OPENSHIFT_HOST, OPENSHIFT_USER_TOKEN, NAMESPACE } = process.env;
  if (!OPENSHIFT_HOST) {
    console.warn('OPENSHIFT_HOST environment variable is not set');
  }
  if (!NAMESPACE) {
    console.warn(`NAMESPACE environment variable is not set, will use the default namespace ${DEFAULT_NAMESPACE}`);
  }
  if (!OPENSHIFT_USER_TOKEN && process.env.NODE_ENV !== 'production') {
    console.warn('OPENSHIFT_USER_TOKEN environment variable is not set');
  }
  const kubeclient = await initKubeClient();

  updateAppsAndWatch(NAMESPACE || DEFAULT_NAMESPACE, kubeclient);

  app.listen(port, () => console.log(`Listening on port ${port}`));
}

run();
