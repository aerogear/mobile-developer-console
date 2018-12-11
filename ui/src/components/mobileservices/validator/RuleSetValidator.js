import { ValidationRule } from './rules/ValidationRule';
import { Constraint } from './constraints/Constraint';

/**
 * This class validates the form according to a given set of rules.
 */
export class RuleSetValidator {
  constructor(name, config = {}) {
    this.name = name;
    this.fields = config.fields || {};
    const { executionConstraints } = config;
    if (executionConstraints) {
      this.executionConstraints = executionConstraints.map(constraintConfig => Constraint.forConfig(constraintConfig));
    }
  }

  validateField(formData, key) {
    const field = this.fields[key];
    if (field) {
      // we have a validation rule for this field
      const { validation_rules: validationRules } = field;
      for (let i = 0; i < validationRules.length; i++) {
        const validationResult = ValidationRule.forRule(validationRules[i]).validate(formData, key);
        if (!validationResult.valid) {
          return validationResult;
        }
      }
    }
    return { valid: true };
  }

  notifyError(errorsCb, key, message) {
    const field = this.fields[key];
    errorsCb(field.errors_key || key, message);
  }

  __checkConstraints(formData) {
    if (this.executionConstraints) {
      for (let i = 0; i < this.executionConstraints.length; i++) {
        if (!this.executionConstraints[i].check(formData)) {
          return false;
        }
      }
    }
    return true;
  }

  validate(formData, errorsCb) {
    if (!this.__checkConstraints(formData)) {
      return false;
    }
    let hasErrors = false;
    for (const key in formData) {
      if (formData.hasOwnProperty(key)) {
        // const value = formData[key];
        const validationResult = this.validateField(formData, key);
        if (!validationResult.valid) {
          this.notifyError(errorsCb, key, validationResult.error);
          hasErrors = true;
        }
      }
    }

    return hasErrors;
  }

  /**
   * Adds a rule to the set
   * @param rule is a json following this structure:
   * {
   *   "fieldName": {
   *     "errors_key": "your key to be used to group this errors. optional."
   *     "validation_rules": [
   *        {
   *          "type": "your validation rule type",
   *          "error": "error to be reported if the rule fails"
   *          // any other option your rule needs
   *        }
   *     ]
   *   }
   * }
   */
  addRule(rule) {
    for (const fieldName in rule) {
      if (rule.hasOwnProperty(fieldName)) {
        const field = this.fields[fieldName];
        if (field) {
          field.errors_key = rule[fieldName].errors_key || field.errors_key;
          field.validation_rules = [...(field.validation_rules || []), ...rule[fieldName].validation_rules];
        } else {
          this.fields[fieldName] = rule[fieldName];
        }
      }
    }
  }
}
