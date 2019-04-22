import axios from 'axios';
import { listWithLabels } from './openshift';
import { keycloakRealmDef, pushVariantDef, metricsApp } from '../models/k8s/definitions';

class MobileServices {
  constructor() {
    this.apiUrl = '/api/mobileservices';
  }

  listForApp(appName) {
    return axios
      .get(this.apiUrl)
      .then(response => response.data)
      .then(serviceItems => serviceItems.items)
      .then(items =>
        items.map(service => {
          const customRes = getCustomResourceForService(service.type);
          if (!customRes) {
            service.customResources = [];
            return Promise.resolve(service);
          }
          return listCustomResourceForApp(customRes, appName).then(servicesCR => {
            service.customResources = servicesCR;
            return service;
          });
        })
      )
      .then(promises => Promise.all(promises))
      .then(services => ({ items: services }));
  }
}

function listCustomResourceForApp(resouceDef, appName) {
  return listWithLabels(resouceDef, { 'mobileclients.aerogear.org/name': appName })
    .then(data => data.items)
    .catch(_err => []); // we ignore errors as the custome resource may not exist
}

function getCustomResourceForService(serviceType) {
  const namespace = window.OPENSHIFT_CONFIG.mdcNamespace;
  let crType = null;
  switch (serviceType) {
    case 'keycloak':
      crType = keycloakRealmDef(namespace);
      return crType;
    case 'push':
      crType = pushVariantDef(namespace);
      return crType;
    case 'metrics':
      crType = metricsApp(namespace);
      return crType;
    default:
      return crType;
  }
}

const mobileServices = new MobileServices();
export { mobileServices, MobileServices };
