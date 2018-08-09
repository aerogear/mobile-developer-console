const baseUrl = `/api`;

const fetchItems = url => {
    return fetch(url, {credentials: "same-origin"})
    .then(response => response.json())
    .then(result => result.items);
};

const dataService = {
    mobileClients: () => {
        return fetchItems(`${baseUrl}/mobileclients`);
    },
    serviceInstances: () => {
        return fetchItems(`${baseUrl}/serviceinstances`);
    },
    builds: () => {
        return fetchItems(`${baseUrl}/builds`);
    },
    buildConfigs: () => {
        return fetchItems(`${baseUrl}/buildconfigs`);
    }
};

export default dataService;