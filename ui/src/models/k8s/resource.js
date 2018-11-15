import { get } from 'lodash-es';
import Metadata from './metadata';
import Spec from './spec';
import Status from './status';

/**
 * A class represents a resource class in k8s with the following fields:
 *   * metadata
 *   * spec
 *   * status
 */
export default class Resource {
  constructor(json = {}) {
    this.data = json;
    this.metadata = new Metadata(this.data.metadata);
    this.spec = new Spec(this.data.spec);
    this.status = new Status(this.data.status);
  }

  /**
   * Get the value for the give path. Supports nested objects.
   * @param {String} path
   */
  get(path) {
    return get(this.data, path);
  }

  toJSON() {
    return { ...this.data };
  }
}
