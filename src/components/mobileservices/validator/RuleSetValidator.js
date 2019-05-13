import { ValidationRule } from './rules/ValidationRule';
import { Constraint } from './constraints/Constraint';

/**
 * This class validates the form according to a given set of rules.
 */
export class RuleSetValidator {
  constructor(name, config = {}) {
    this.name = name;
    this.fields = flatKeys(config.fields) || {};
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
    for (const key in this.fields) {
      if (this.fields.hasOwnProperty(key)) {
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

/**
 * A small utility function to flatten a nested object that has rules.
 * For example, it will convert this object:
 * {
 *   a: {
 *     b: {
 *        validation_rules: [],
 *        errors_key: ''
 *     }
 *   },
 *   c: {
 *     validation_rules: []
 *   }
 * }
 * to this:
 * {
 *   'a.b' : {validation_rules: [], errors_key: ''},
 *   'c': {
 *     validation_rules: []
 *   }
 * }
 * @param {object} object input object
 * @param {array} path paths so far
 * @param {object} out object to return
 */
function flatKeys(object, path, out) {
  const p = path || [];
  const result = out || {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const parent = p.concat([key]);
      if (object[key].errors_key || object[key].validation_rules) {
        result[parent.join('.')] = object[key];
      } else {
        flatKeys(object[key], parent, result);
      }
    }
  }
  return result;
}
