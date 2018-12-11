// {
//   "type": "SAMEVALUEOF",
//   "error": "APNS certificate passphrase is required."
//   "target": "fieldname"
// }

import { isFunction } from 'lodash-es';

export class SameValueOfRule {
  constructor(config) {
    this.config = config;
    this.target = config.target;
  }

  validate(data, key) {
    const value = data[key];
    const targetValue = isFunction(this.target) ? this.target() : data[this.target];
    if (value !== targetValue) {
      return {
        valid: false,
        error: this.config.error
      };
    }
    return { valid: true };
  }
}

export const NAME = 'SAMEVALUEOF';
