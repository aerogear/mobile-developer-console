/* eslint no-continue: off */
/* eslint class-methods-use-this: off */
export class AbstractBindingValidator {
  constructor(platform, customProperties = {}) {
    this.customProperties = customProperties;

    this.detectPlatform = customProperties.platformDetector;
    this.errorsKey = customProperties.errorField;
    this.platform = platform;
  }

  addError(errors, key, message) {
    errors[this.errorsKey || key].addError(message);
  }

  preFieldValidation(key, value) {
    if (this.customProperties.preValidate) {
      return this.customProperties.preValidate(key, value);
    }
    return false;
  }

  validateField(key, value) {
    return false;
  }

  postFieldValidation(key, value) {
    if (this.customProperties.postValidate) {
      return this.customProperties.postValidate(key, value);
    }
    return false;
  }

  validate(formData, errors) {
    let hasErrors = false;
    if (this.platform && this.detectPlatform && this.detectPlatform() !== this.platform) {
      return false;
    }

    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const value = formData[key];

        let error = this.preFieldValidation(key, value);
        if (error) {
          hasErrors = true;
          this.addError(errors, key, error);
          continue;
        }

        error = this.validateField(key, value);
        if (error) {
          hasErrors = true;
          this.addError(errors, key, error);
          continue;
        }

        error = this.postFieldValidation(key, value);
        if (error) {
          hasErrors = true;
          this.addError(errors, key, error);
        }
      }
    }

    return hasErrors;
  }
}
