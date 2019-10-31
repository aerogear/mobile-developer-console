import { get } from 'lodash-es';
import isEmail from 'validator/lib/isEmail';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a simple rule to check that the value in the field is a valid mailto.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "ismailto",  // this must be exactly 'regexp',
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class ValidMailToRule extends ValidationRuleBaseClass {
  validate(formData, key) {
    const value = get(formData, key);

    if (!value || !value.startsWith('mailto:') || value === 'mailto:' || !isEmail(value.substring(7).trim())) {
      return {
        valid: false,
        error: this.getErrorMessage({ key, message: `value of ${key} must be a valid mailto address` })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'ismailto';
