import { get } from 'lodash-es';
import isUrl from 'validator/lib/isURL';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a simple rule to check that the value in the field is a valid url address.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "isurl",  // this must be exactly 'regexp',
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class ValidUrlRule extends ValidationRuleBaseClass {
  validate(formData, key) {
    const value = get(formData, key);
    if (
      !value ||
      !isUrl(value, {
        require_tld: !!this.config.require_tld,
        require_host: !!this.config.require_host,
        require_protocol: this.config.require_protocol === true || this.config.require_protocol === undefined
      })
    ) {
      return {
        valid: false,
        error: this.getErrorMessage({ key, message: `value of ${key} must be a valid url address` })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'isurl';
