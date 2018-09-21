const baseUrl = `/api`

const fetchItems = url => {
  return fetch(url, {credentials: "same-origin"})
    .then(response => response.json())
    .then(result => result.items || [])
}

const dataService = {
  mobileClients: () => {
    return fetchItems(`${baseUrl}/mobileclients`)
  },
  serviceInstances: () => {
    return fetchItems(`${baseUrl}/serviceinstances`)
  },
  builds: () => {
    return fetchItems(`${baseUrl}/builds`)
  },
  buildConfigs: () => {
    return fetchItems(`${baseUrl}/buildconfigs`)
  },
  createApp: async app => {
    const response = await fetch(`${baseUrl}/mobileclients`, {
      method: "POST",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(app)
    })
    return await response.json()
  }
};

export default dataService