/**
 * Base class for the status field in the k8s objects
 */
import { get } from 'lodash-es';

export default class Status {
  constructor(statusjson = {}) {
    this.data = statusjson;
  }

  /**
   * Get the value for the give path. Supports nested objects.
   * @param {String} path
   */
  get(path) {
    return get(this.data, path, null);
  }

  toJSON() {
    return { ...this.data };
  }
}
