import { get } from 'lodash-es';
import isEmail from 'validator/lib/isEmail';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a simple rule to check that the value in the field matches the given regex.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "isemail",  // this must be exactly 'regexp',
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class ValidEmailRule extends ValidationRuleBaseClass {
  validate(formData, key) {
    const value = get(formData, key);
    if (!isEmail(value)) {
      return {
        valid: false,
        error: this.getErrorMessage({ key, message: `value of ${key} must be a valid email address` })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'isemail';
