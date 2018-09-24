import { Component } from 'react';
import { set as _set, get as _get } from 'lodash-es';

export class SubState {
  /**
   * Create structured state
   * @param {Component} component component
   * @param {string} path path to the state in component's state
   */
  constructor(component, path) {
    this.component = component;
    this.path = path;
  }

  /**
   * Gets value from the state
   * @param {string} item path to the value
   * @param {*} [defaultValue] default value
   */
  get(item = undefined, defaultValue = undefined) {
    const path = item ? `${this.path}.${item}` : this.path;
    return _get(this.component.state, path, defaultValue);
  }

  /**
   * Gets value from the state, or empty object
   * @param {string} item path to the value
   */
  getOrEmpty(item = undefined) {
    return this.get(item, {});
  }

  /**
   * Sets multiple values on the state
   * @param {*} item path to the state
   * @param {Object} values values
   */
  setState(values) {
    this.component.setState(prevState => {
      const oldValues = _get(prevState, this.path);
      const newValues = { ...oldValues, ...values };
      const newConfig = _set(prevState, this.path, newValues);
      return { ...prevState, ...newConfig };
    });
  }

  /**
   * Sets single value on the state
   * @param {*} key key
   * @param value value
   */
  set(key, value) {
    this.setState({ [key]: value });
  }
}
