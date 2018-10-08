import { Component } from 'react';
import { set as _set, get as _get } from 'lodash-es';
import { VALIDATION_WARN, VALIDATION_OK } from './Validation';

export class SubState {
  /**
   * Create structured state
   * @param {Component} component component
   * @param {string} path path to the state in component's state
   * @param {function validationFunc(string)} validationFunc function to validate the state {
     
   }}
   */
  constructor(component, path, validationFunc = undefined, mandatoryFields = []) {
    this.component = component;
    this.path = path;
    this.validationFunc = validationFunc;
    this.validationState = {};
    this.mandatoryFields = mandatoryFields;
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
      this.validate(values);
      return { ...prevState, ...newConfig };
    });
  }

  /**
   * Performs validation of the items of the state.
   * @param {object} values to be validated
   */
  validate(values = this.getOrEmpty()) {
    if (this.validationFunc) {
      Object.keys(values).forEach(key => {
        this.validationState[key] = this.validationFunc(values, key, values[key]);
      });
    }
  }

  /**
   * Returns validation state of the item of the state.
   * @param {string} key key of the state
   * @returns {null|'success'|'warning'|'error'} validation state
   */
  getValidationState(key) {
    return this.validationState[key];
  }

  /**
   * Checks the state.
   * @param {object} values to be validated
   * @returns {boolean} true=everything is valid, false=not valid
   */
  isAllValid(values = this.getOrEmpty()) {
    let result = true;
    this.mandatoryFields.forEach(field => {
      result = result && this.get(field);
    });
    if (result && this.validationFunc) {
      Object.keys(values).forEach(key => {
        const valid = this.validationFunc(values, key, values[key]);
        result = result && (valid === VALIDATION_OK || valid === VALIDATION_WARN);
      });
    }
    return result;
  }

  /**
   * Sets single value on the state
   * @param {*} key key
   * @param value value
   */
  set(key, value) {
    this.setState({ [key]: value });
    this.validate();
  }
}
