import { ValidationRuleBaseClass } from './ValidationRuleBaseClass';
import { ValidationRule } from './ValidationRule';

/**
 * This rule demands the validation to a list of subrules.
 * The validation can be in the form of 'all' or 'any': in the first case all of the subrules must success, in the second
 * case at least one subrule must success.
 * It must be configured inside the JSON file as follows:
 * {
 *   "type": "composite",  // this must be exactly 'regexp',
 *   "algorithm": "all", // this can be 'all' or 'any'
 *   "error": "Your error message"          // Optional. The custom error message.
 *                                          // This can be a string, a dictionary or a function (signature: (key, message) => {})
 *                                          // If not specified, a standard error message is returned.
 *   "validation_rules": [
 *     // put here the validation rules
 *   ]
 * }
 */
export class CompositeRule extends ValidationRuleBaseClass {
  validate(formData, key) {
    const validCount = this.config.validation_rules.reduce((total, ruleDef) => {
      const validationResult = ValidationRule.forRule(ruleDef).validate(formData, key);
      return total + (validationResult.valid ? 1 : 0);
    }, 0);

    const result = {};

    if (this.config.algorithm === 'all') {
      result.valid = validCount === this.config.validation_rules.length;
    } else {
      result.valid = validCount > 0;
    }
    if (!result.valid) {
      result.error = this.getErrorMessage({ key, message: `${key} is not valid` });
    }
    return result;
  }
}

export const NAME = 'composite';
