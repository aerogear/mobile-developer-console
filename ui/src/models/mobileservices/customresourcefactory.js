import { CustomResource } from './customresource';
import { KeycloakRealmCR } from './keycloakrealmcr';
import { PushVariantCR } from './pushvariantcr';

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
  return new CustomResource(data);
}
