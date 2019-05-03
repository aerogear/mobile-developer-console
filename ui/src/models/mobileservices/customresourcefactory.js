import { CustomResource } from './customresource';
import { KeycloakRealmCR } from './keycloakrealmcr';
import { PushVariantCR } from './pushvariantcr';
import { MetricsCR } from './metricscr';

/**
 * Produce an instance of a custom resouce based on the passed in data.
 * For now it always return an instance of the base CustomResource class, but it can be easily changed to return subclasses.
 * @param {*} data
 */
export function newCustomResource(data) {
  if (data && data.kind === 'KeycloakRealm') {
    return new KeycloakRealmCR(data);
  }
  // TODO: use the right kind
  if (data && data.kind === 'PushVariant') {
    return new PushVariantCR(data);
  }
  if (data && data.kind === 'MetricsApp') {
    return new MetricsCR(data);
  }
  return new CustomResource(data);
}

export function newCustomResourceClass(type) {
  if (type === 'KeycloakRealm') {
    return KeycloakRealmCR;
  }
  // TODO: use the right kind
  if (type === 'PushVariant') {
    return PushVariantCR;
  }
  if (type === 'MetricsApp') {
    return MetricsCR;
  }
  return CustomResource;
}
