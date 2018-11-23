/**
 * This constraint is used to constraint the ruleset to the value of a given field in the form.
 * The configuration to be put into the JSON file for this rule must be as follows:
 * {
 *   "type": "FIELD_VALUE",  // this must be exactly 'FIELD_VALUE'
 *   "name": "field_name",   // the name of the field to be checked
 *   "value": "value"        // the value to be checked
 * }
 */
export class FieldValueConstraint {
  constructor(config) {
    this.config = config;
  }

  /**
   * Returns true if the configured field has the configured value into formData
   * @param formData
   * @returns {boolean}
   */
  check(formData) {
    return formData[this.config.name] === this.config.value;
  }
}

export const NAME = 'FIELD_VALUE';
