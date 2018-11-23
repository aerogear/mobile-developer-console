import { RuleSetValidator } from './RuleSetValidator';

/**
 * Performs the form validation based on a set of rules defined in a JSON file.
 * The structure of the JSON is:
 * {
 *   "ruleset": {
 *     "ruleset_name": {
 *       "executionConstraints": [
 *         {
 *           "comment": "constraint configuration: look at the constraints to see what should be put here. This is an optional section."
 *         }
 *       ]
 *     },
 *     "fields": {
 *       "field_name": {
 *         "errors_key": "this is optional. It is the key used to bound the error messages into the UI",
 *         "validation_rules": [
 *           {
 *             "comment": "a set of rules to be executed. Look at rules to see what should be put here"
 *           }
 *         ]
 *       }
 *     }
 *   }
 * }
 */
export class FormValidator {
  constructor(config) {
    this.ruleSets = [];
    this.postValidation = [];
    for (const [rulesetName, rulesetDefinition] of Object.entries(config.rulesets)) {
      this.ruleSets.push(new RuleSetValidator(rulesetName, rulesetDefinition));
    }
  }

  /**
   * Validates the form
   * @param formData for to be validated
   * @param errors container for the errors
   * @returns {boolean} true if the form is valid
   */
  validate(formData, errors) {
    let hasErrors = false;
    for (let i = 0; i < this.ruleSets.length; i++) {
      if (this.ruleSets[i].validate(formData, errors)) {
        hasErrors = true;
      }
    }

    if (!hasErrors) {
      for (let i = 0; i < this.postValidation.length; i++) {
        if (this.postValidation[i](formData, errors)) {
          hasErrors = true;
        }
      }
    }
    return !hasErrors;
  }

  /**
   * Custom form validation to be executed after the configured validation has been successful (optional).
   * More than one function can be passed by invoking this method more than one time.
   * @param postValidateFunction
   * @returns {FormValidator}
   */
  withPostValidation(postValidateFunction) {
    this.postValidation.push(postValidateFunction);
    return this;
  }
}
