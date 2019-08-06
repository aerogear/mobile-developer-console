import { get } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * Checks that the passed in value has a length smaller or equal than the configured maxlength property.
 *
 * {
 *   "type": "maxlength",  // this must be exactly 'maxlength'
 *   "length" 36,          // the maximum length limit of this field value
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
        error: this.getErrorMessage({
          key,
          message: `${key} is too long, maximum length is ${this.maxlength} characters`
        })
      };
    }
    return { valid: true };
  }
}

export const NAME = 'maxlength';
