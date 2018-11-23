/* eslint no-continue: off */
/* eslint class-methods-use-this: off */
/**
 * Base class for validation.
 */
export class AbstractBindingValidator {
  /**
   * Constructor
   * @param platform The platform supported by this validator. If the currently chosen platform is different than this, no validation is performed.
   * @param errorField Optional. The field to be used to add the error messages. If not specified, the error is attached to the validated field itself.
   * @param platformDetector A function that returns the platform chosen by the user.
   * @param preValidate Optional. A function that is executed before the validation. If this returns an error (non false), the validation flows is interrupted.
   * @param postValidate Optional. A function that is executed after the validation.
   */
  constructor({ platform, errorField, platformDetector, preValidate, postValidate } = {}) {
    this.detectPlatform = platformDetector;
    this.errorsKey = errorField;
    this.platform = platform;
    this.preValidate = preValidate;
    this.postValidate = postValidate;
  }

  /**
   * Adds an error relative to the specified key
   * @param errors the error container
   * @param key the key that has been validated
   * @param message the error to be reported
   */
  addError(errors, key, message) {
    errors[this.errorsKey || key].addError(message);
  }

  __preFieldValidation(key, value) {
    if (this.preValidate) {
      return this.preValidate(key, value);
    }
    return false;
  }

  /**
   * This method must be overridden by the real implementation.
   * @param key name of the field to be validated
   * @param value value of the field to be validated
   * @returns {*} returns a string with the error message if the validation fails, false otherwise
   */
  validateField(key, value) {
    return false;
  }

  __postFieldValidation(key, value) {
    if (this.postValidate) {
      return this.postValidate(key, value);
    }
    return false;
  }

  /**
   * Executes the validation flow as follows:
   * 1. pre validation
   * 2. validation
   * 3. post validation
   * Each of the steps can return an error that will be shown into the UI.
   * The first step returning an error, interrupts the flow.
   * @param formData form data to be validated
   * @param errors container for error messages
   * @returns {boolean} true if error has been found, false otherwise
   */
  validate(formData, errors) {
    let hasErrors = false;
    if (this.platform && this.detectPlatform && this.detectPlatform() !== this.platform) {
      return false;
    }
    const flow = [
      this.__preFieldValidation.bind(this),
      this.validateField.bind(this),
      this.__postFieldValidation.bind(this)
    ];
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const value = formData[key];
        for (let i = 0; i < flow.length; i++) {
          const error = flow[i](key, value);
          if (error) {
            this.addError(errors, key, error);
            hasErrors = true;
            break;
          }
        }
      }
    }

    return hasErrors;
  }
}
