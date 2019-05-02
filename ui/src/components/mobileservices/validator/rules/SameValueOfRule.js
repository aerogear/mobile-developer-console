import { get, isFunction } from 'lodash-es';
import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';

/**
 * This rule checks that the specified field has the same value of a target field.
 * If the specified `target field` is a function, the rule checks that the value of the field is the same as the result
 * of the function (the function signature should be () => { } ).
 * The configuration of this rule must be something like:
 * {
 *   "type": "SAMEVALUEOF",           // this is a fixed string identifying this rule
 *   "error": "Your custom error",    // Optional. The custom error message.
 *                                    // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                    // If not specified, a standard error message is returned.
 *   "target": "target fieldname"     // The target field name that contains the expected value.
 * }
 */
export class SameValueOfRule extends ValidationRuleBaseClass {
  constructor(config) {
    super(config);
    this.target = config.target;
  }

  validate(data, key) {
    const value = get(data, key);
    const targetValue = isFunction(this.target) ? this.target() : get(data, this.target);
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
