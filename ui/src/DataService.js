let baseUrl = '/api';

if (process.env.NODE_ENV !== 'production') {
  baseUrl = 'http://localhost:8080/http://localhost:4000/api';
}
baseUrl = 'http://localhost:4000/api';

const fetchItems = async (url) => {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw Error(response.statusText);
  }
  const result = await response.json();
  return result.items || [];
};

const dataService = {
  mobileClients: () => fetchItems(`${baseUrl}/mobileclients`),
  serviceInstances: () => fetchItems(`${baseUrl}/serviceinstances`),
  builds: () => fetchItems(`${baseUrl}/builds`),
  buildConfigs: () => fetchItems(`${baseUrl}/buildconfigs`),
  createBuildConfig: async (config) => {
    const response = await fetch(`${baseUrl}/buildconfigs`, {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(config),
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  },
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
};

export default dataService;
