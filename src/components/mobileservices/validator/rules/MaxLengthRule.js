import { get } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This is a very simple rule. Checks that the configured field value length is greater than the one that is expected.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "maxlength",  // this must be exactly 'maxlength'
 *   "length" 36,          // the maximum length limit of this field value
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 * }
 */
export class MaxLengthRule extends ValidationRuleBaseClass {
  constructor(config) {
    super(config);
    this.maxlength = config.length;
  }

  validate(formData, key) {
    const value = get(formData, key);

    if (value.length > this.maxlength) {
      return {
        valid: false,
        error: this.getErrorMessage({ key, message: `${key} is too big, maximum length is ${this.maxlength}` })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'maxlength';
