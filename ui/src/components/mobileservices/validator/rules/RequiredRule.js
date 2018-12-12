import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a very simple rule. Checks that the configured field has a value.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "required",  // this must be exactly 'required'
 *   "error": "Your error message" // Optional. The error to be returned if the field has no value. If not specified a default message is used.
 * }
 */
export class RequiredRule extends ValidationRuleBaseClass {
  validate(formData, key) {
    const value = formData[key];
    if (!value || !value.trim()) {
      return {
        valid: false,
        error: this.getErrorMessage({ key, message: `${key} is a required field.` })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'required';
