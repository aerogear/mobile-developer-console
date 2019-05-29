import { CustomResource } from './customresource';
import { KeycloakRealmCR } from './keycloakrealmcr';
import { PushVariantCR } from './pushvariantcr';
import { MetricsCR } from './metricscr';
import { DataSyncCR } from './datasync';

/**
 * Produce an instance of a custom resouce based on the passed in data.
 * For now it always return an instance of the base CustomResource class, but it can be easily changed to return subclasses.
 * @param {*} data
 */
export function newCustomResource(serviceInfo, data) {
  if (serviceInfo.type === 'keycloak') {
    return new KeycloakRealmCR(data);
  }
  if (serviceInfo.type === 'sync-app') {
    return new DataSyncCR(data);
  }
  // TODO: use the right kind
  if (serviceInfo.type === 'push') {
    return new PushVariantCR(data);
  }
  if (serviceInfo.typ === 'metrics') {
    return new MetricsCR(data);
  }
  return new CustomResource(data);
}

export function newCustomResourceClass(serviceInfo) {
  if (serviceInfo.type === 'keycloak') {
    return KeycloakRealmCR;
  }
  if (serviceInfo.type === 'sync-app') {
    return DataSyncCR;
  }
  // TODO: use the right kind
  if (serviceInfo.type === 'push') {
    return PushVariantCR;
  }
  if (serviceInfo.typ === 'metrics') {
    return MetricsCR;
  }
  return CustomResource;
}
