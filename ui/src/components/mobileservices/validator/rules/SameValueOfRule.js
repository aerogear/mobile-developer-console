// {
//   "type": "SAMEVALUEOF",
//   "error": "APNS certificate passphrase is required."
//   "target": "fieldname"
// }

import { isFunction } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

export class SameValueOfRule extends ValidationRuleBaseClass {
  constructor(config) {
    super(config);
    this.target = config.target;
  }

  validate(data, key) {
    const value = data[key];
    const targetValue = isFunction(this.target) ? this.target() : data[this.target];
    if (value !== targetValue) {
      return {
        valid: false,
        error: this.getErrorMessage(key, `Value of field ${key} does not match the required value`)
      };
    }
    return { valid: true };
  }
}

export const NAME = 'SAMEVALUEOF';
