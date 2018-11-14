import { BoundMobileService, UnboundMobileService } from './models/mobileService';

const getWSUrl = () => {
  const loc = window.location;
  let newUrl;
  if (loc.protocol === 'https:') {
    newUrl = 'wss:';
  } else {
    newUrl = 'ws:';
  }
  newUrl += `//${loc.host}`;
  return newUrl;
};

const baseUrl = '/api';
const wsUrl = `${getWSUrl()}/api`;

export const wsError = {};

const requestConfig = (method, body) => ({
  method,
  cache: 'no-cache',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  body: body && JSON.stringify(body)
});

const request = async (url, method, body) => {
  const response = await fetch(`${baseUrl}/${url}`, requestConfig(method, body));
  if (!response.ok) {
    const msg = await response.text();
    throw Error(msg);
  }
  return method === 'DELETE' || response.json();
};

const fetchItems = async url => {
  const result = await request(url, 'GET');
  return result.items || [];
};

const deleteItem = async (url, name) => {
  await request(url, 'DELETE');
  return name;
};

const webSocket = (action, url) => {
  const ws = new WebSocket(wsUrl + url);
  let active = false;
  ws.onmessage = () => {
    if (!active) {
      active = true;
      setTimeout(() => {
        active = false;
        action();
      }, 1000);
    }
  };
  ws.onerror = () => {
    wsError.message = 'WebSocket error';
  };
  return ws;
};

const dataService = {
  mobileClients: () => fetchItems('mobileclients'),
  serviceInstances: () => fetchItems('serviceinstances'),
  builds: () => fetchItems('builds'),
  buildConfigs: () => fetchItems('buildconfigs'),
  createApp: app => request('mobileclients', 'POST', app),
  mobileApp: appName => request(`mobileclients/${appName}`, 'GET'),
  deleteApp: name => deleteItem(`mobileclients/${name}`, name),
  triggerBuild: name => request(`buildconfigs/${name}/instantiate`, 'POST'),
  deleteBuildConfig: name => deleteItem(`buildconfigs/${name}`, name),
  updateApp: async (id, app) => {
    const response = await fetch(`${baseUrl}/mobileclients/${id}`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(app)
    });
    if (!response.ok) {
      const msg = await response.text();
      throw Error(`${response.statusText}: ${msg}`);
    }
    return response.json();
  },
  createBuildConfig: async config => {
    const response = await fetch(`${baseUrl}/buildconfigs`, requestConfig('POST', config));
    if (!response.ok) {
      const msg = await response.text();
      throw Error(msg);
    }
    return response.json();
  },
  watchBuilds: action => webSocket(action, '/builds/watch'),
  watchApps: action => webSocket(action, '/mobileclients/watch'),
  watchBuildConfigs: action => webSocket(action, '/buildconfigs/watch'),
  watchServices: action => webSocket(action, '/serviceinstances/watch'),
  generateDownloadURL: name => request(`builds/${name}/gendownloadurl`, 'POST'),
  fetchUser: () => request('user', 'GET'),
  bindableServices: async mobileClientName => {
    const unboundServices = [];
    const boundServices = [];

    const instances = await fetchItems(`bindableservices/${mobileClientName}`);

    instances.forEach(instance => {
      if (instance.isBound) {
        boundServices.push(new BoundMobileService(instance));
      } else {
        unboundServices.push(new UnboundMobileService(instance));
      }
    });

    return { boundServices, unboundServices };
  },
  createBinding: async (
    mobileClientName,
    serviceInstanceName,
    credentialSecretName,
    parametersSecretName,
    serviceClassExternalName,
    formData
  ) => {
    const binding = {
      mobileClientName,
      serviceInstanceName,
      bindingParametersName: parametersSecretName,
      bindingSecretName: credentialSecretName,
      serviceClassExternalName,
      formData
    };

    const response = await fetch(`${baseUrl}/bindableservices`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(binding)
    });
    if (!response.ok) {
      const msg = await response.text();
      throw Error(`${response.statusText}: ${msg}`);
    }
    return response.json();
  },
  deleteBinding: name => deleteItem(`bindableservices/${name}`, name)
};

export default dataService;
