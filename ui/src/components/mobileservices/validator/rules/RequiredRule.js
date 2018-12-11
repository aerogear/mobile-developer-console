/**
 * This is a very simple rule. Checks that the configured field has a value.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "required",  // this must be exactly 'required'
 *   "error": "Your error message" // Optional. The error to be returned if the field has no value. If not specified a default message is used.
 * }
 */
export class RequiredRule {
  constructor(config) {
    this.config = config;
  }

  validate(formData, key) {
    const value = formData[key];
    if (!value || !value.trim()) {
      return {
        valid: false,
        error: this.config.error || `${key} is a required field.`
      };
    }
    return { valid: true };
  }
}

export const NAME = 'required';
