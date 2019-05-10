/**
 * K8S ObjectMeta type.
 * The info here should be readonly and you should not need to modify this object.
 */
import { get } from 'lodash-es';

export default class Metadata {
  constructor(metajson = {}) {
    this.data = metajson;
  }

  getName() {
    return get(this.data, 'name');
  }

  getNamespace() {
    return get(this.data, 'namespace');
  }

  getSelfLink() {
    return get(this.data, 'selfLink');
  }

  getUID() {
    return get(this.data, 'uid');
  }

  get(path) {
    return get(this.data, path, null);
  }

  toJSON() {
    return { ...this.data };
  }
}
