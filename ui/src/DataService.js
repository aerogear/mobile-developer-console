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

let baseUrl = '/api';
let wsUrl = `${getWSUrl()}/api`;

if (process.env.NODE_ENV !== 'production') {
  baseUrl = 'http://localhost:8080/http://localhost:4000/api';
  wsUrl = 'ws://localhost:4000/api';
}

const fetchItems = async (url) => {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result.items || [];
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
};

const dataService = {
  mobileClients: () => fetchItems(`${baseUrl}/mobileclients`),
  serviceInstances: () => fetchItems(`${baseUrl}/serviceinstances`),
  builds: () => fetchItems(`${baseUrl}/builds`),
  buildConfigs: () => fetchItems(`${baseUrl}/buildconfigs`),
  createApp: async (app) => {
    const response = await fetch(`${baseUrl}/mobileclients`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(app),
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  },
  triggerBuild: async (name) => {
    const response = await fetch(`${baseUrl}/buildconfigs/${name}/instantiate`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  },
  deleteBuildConfig: async (name) => {
    const response = await fetch(`${baseUrl}/buildconfigs/${name}`, {
      method: 'DELETE',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return name;
  },
  watchBuilds: action => webSocket(action, '/builds/watch'),
  watchApps: action => webSocket(action, '/mobileclients/watch'),
  watchBuildConfigs: action => webSocket(action, '/buildconfigs/watch'),
  watchServices: action => webSocket(action, '/serviceinstances/watch'),
};

export default dataService;
