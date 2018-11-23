import { ValidationRule } from './rules/ValidationRule';
import { Constraint } from './constraints/Constraint';

/**
 * This class validates the form according to a given set of rules.
 */
export class RuleSetValidator {
  constructor(name, config) {
    this.name = name;
    this.fields = config.fields;
    const { executionConstraints } = config;
    if (executionConstraints) {
      this.executionConstraints = executionConstraints.map(constraintConfig => Constraint.forConfig(constraintConfig));
    }
  }

  validateField(key, value) {
    const field = this.fields[key];
    if (field) {
      // we have a validation rule for this field
      const { validation_rules: validationRules } = field;
      for (let i = 0; i < validationRules.length; i++) {
        const validationResult = ValidationRule.forRule(validationRules[0]).validate(key, value);
        if (!validationResult.valid) {
          return validationResult;
        }
      }
    }
    return { valid: true };
  }

  addError(errors, key, message) {
    const field = this.fields[key];
    errors[field.errors_key || key].addError(message);
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

  validate(formData, errors) {
    if (!this.__checkConstraints(formData)) {
      return false;
    }
    let hasErrors = false;
    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        const value = formData[key];
        const validationResult = this.validateField(key, value);
        if (!validationResult.valid) {
          this.addError(errors, key, validationResult.error);
          hasErrors = true;
        }
      }
    }

    return hasErrors;
  }
}
