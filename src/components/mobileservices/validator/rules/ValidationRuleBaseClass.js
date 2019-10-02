import { isString, isFunction } from 'lodash-es';

/**
 * Base class for validation rules.
 */
export class ValidationRuleBaseClass {
  constructor(config = {}) {
    this.config = config;
    this.validateConfig(config);
  }

  // eslint-disable-next-line class-methods-use-this
  validateConfig(config) {}

  getErrorMessage(error) {
    const customError = this.config.error;
    let errorMessage;
    if (customError) {
      if (isString(customError)) {
        errorMessage = customError;
      } else if (isFunction(customError)) {
        errorMessage = customError(error.key, error.message);
      } else {
        errorMessage = customError[error.key];
      }
    }
    return errorMessage || error.message;
  }
}
