import { get } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a simple rule to check that the value in the field matches the given regex.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "regexp",  // this must be exactly 'regexp',
 *   "regexp": <pattern>, //the regular expression. Should be a RegExp object.
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class RegExpRule extends ValidationRuleBaseClass {
  constructor(config) {
    super(config);
    this.regexp = config.regexp;
  }

  validate(formData, key) {
    const value = get(formData, key);
    if (!this.regexp.test(value)) {
      return {
        valid: false,
        error: this.getErrorMessage({ key, message: `${key} does not match regexp ${this.regexp.toString()}` })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'regexp';
