/**
 * Base class for the `Spec` types in K8S.
 */
import { get, set } from 'lodash-es';

export default class Spec {
  constructor(specjson = {}) {
    this.data = specjson;
  }

  /**
   * Set the value for the path. Supports nested objects.
   * @param {String} path
   * @param {*} value
   */
  set(path, value) {
    set(this.data, path, value);
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
