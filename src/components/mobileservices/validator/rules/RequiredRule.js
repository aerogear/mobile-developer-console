import { get } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a very simple rule. Checks that the configured field has a value.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "required",  // this must be exactly 'required'
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class RequiredRule extends ValidationRuleBaseClass {
  validate(formData, key) {
    const value = get(formData, key);
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
