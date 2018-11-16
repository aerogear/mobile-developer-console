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
    return this.get('name');
  }

  getNamespace() {
    return this.get('namespace');
  }

  getSelfLink() {
    return this.get('selfLink');
  }

  getUID() {
    return this.get('uid');
  }

  get(path) {
    return get(this.data, path, null);
  }

  toJSON() {
    return { ...this.data };
  }
}
