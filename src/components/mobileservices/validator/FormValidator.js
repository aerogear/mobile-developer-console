import { RuleSetValidator } from './RuleSetValidator';

/**
 * Performs the form validation based on a set of rules defined in a JSON file.
 * The structure of the JSON is:
 * {
 *   "rulesets": {
 *     "ruleset_name": {
 *       "executionConstraints": [
 *         {
 *           "comment": "constraint configuration: look at the constraints to see what should be put here. This is an optional section."
 *         }
 *       ],
 *       "fields": {
 *          "field_name": {
 *            "errors_key": "this is optional. It is the key used to bound the error messages into the UI",
 *            "validation_rules": [
 *              {
 *                "comment": "a set of rules to be executed. Look at rules to see what should be put here"
 *              }
 *            ]
 *          }
 *        }
 *     }
 *   }
 * }
 */
export class FormValidator {
  constructor(config = {}) {
    this.ruleSets = {};
    for (const [rulesetName, rulesetDefinition] of Object.entries(config.rulesets || config)) {
      this.ruleSets[rulesetName] = new RuleSetValidator(rulesetName, rulesetDefinition);
    }
  }

  /**
   * Validates the form
   * @param formData for to be validated
   * @param {Function} errorsCb(key, message) a callback used to notify the caller about validation errors. key is the
   * key identifying the error group, while message is the message error.
   * @returns {boolean} true if the form is valid
   */
  validate(formData, errorsCb) {
    let hasErrors = false;

    for (const rulesetName in this.ruleSets) {
      if (this.ruleSets.hasOwnProperty(rulesetName) && this.ruleSets[rulesetName].validate(formData, errorsCb)) {
        hasErrors = true;
      }
    }
    return !hasErrors;
  }

  withRule(ruleSetName, rule) {
    let ruleSet = this.ruleSets[ruleSetName];
    if (!ruleSet) {
      ruleSet = new RuleSetValidator(ruleSetName);
      this.ruleSets[ruleSetName] = ruleSet;
    }
    ruleSet.addRule(rule);
    return this;
  }
}
