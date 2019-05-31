const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const promMid = require('express-prometheus-middleware');
const Prometheus = require('prom-client');
const { Client } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');
const packageJson = require('../package.json');
const fs = require('fs');
const {
  PushService,
  IdentityManagementService,
  MetricsService,
  DataSyncService,
  MobileServicesMap
} = require('./mobile-services-info');

const app = express();
let kubeclient;

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
const DEFAULT_SERVICES = {
  services: [
    {
      type: IdentityManagementService.type,
      url: `https://${process.env.IDM_URL || process.env.OPENSHIFT_HOST}`
    },
    // {
    //   type: PushService.type,
    //   url: `https://${process.env.UPS_URL || process.env.OPENSHIFT_HOST}`
    // },
    // {
    //   type: MetricsService.type,
    //   url: `https://${process.env.METRICS_URL || process.env.OPENSHIFT_HOST}`
    // }
    {
      type: DataSyncService.type
    }
  ]
};

// metric endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', Prometheus.register.contentType);
  res.end(Prometheus.register.metrics());
});

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

app.get('/api/mobileclient/:name/config', (req, res) => {
  const mdcNamespace = process.env.NAMESPACE || 'myproject';
  const appName = req.params.name;
  const data = {
    version: 1,
    namespace: mdcNamespace,
    clientId: appName
  };
  const services = [PushService, IdentityManagementService, MetricsService, DataSyncService];
  const promises = services.map(service => service.getClientConfig(mdcNamespace, appName, kubeclient));
  Promise.all(promises).then(serviceConfigs => {
    data.services = serviceConfigs.filter(Boolean);
    return res.json(data);
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
    ENABLE_BUILD_TAB,
    DOCS_PREFIX
  } = process.env;
  let userToken = OPENSHIFT_USER_TOKEN;
  let userName = OPENSHIFT_USER_NAME || 'testuser';
  let userEmail = OPENSHIFT_USER_EMAIL || 'testuser@localhost';
  const mdcNamespace = NAMESPACE || 'myproject';
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

  return `window.OPENSHIFT_CONFIG = {
    mdcNamespace: '${mdcNamespace}',
    masterUri: 'https://${process.env.OPENSHIFT_HOST}',
    wssMasterUri: 'wss://${process.env.OPENSHIFT_HOST}',
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
    .then(servicesUrls => servicesUrls.services)
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
    kubeclient = new Client({ backend });
    await kubeclient.loadSpec();
  } catch (e) {
    console.error('Failed to init kube client', e);
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
  const { OPENSHIFT_HOST, OPENSHIFT_USER_TOKEN } = process.env;
  if (!OPENSHIFT_HOST) {
    console.warn('OPENSHIFT_HOST environment variable is not set');
  }
  if (!OPENSHIFT_USER_TOKEN && process.env.NODE_ENV !== 'production') {
    console.warn('OPENSHIFT_USER_TOKEN environment variable is not set');
  }
  await initKubeClient();
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

run();
