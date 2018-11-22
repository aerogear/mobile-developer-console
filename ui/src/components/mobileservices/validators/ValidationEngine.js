export class ValidationEngine {
  constructor(formData, errors) {
    this.validators = [];
    this.formData = formData;
    this.errors = errors;
  }

  with(validator) {
    this.validators.push(validator);
    return this;
  }

  validate() {
    let hasErrors = false;
    for (const key in this.validators) {
      if (this.validators.hasOwnProperty(key)) {
        hasErrors = hasErrors || this.validators[key].validate(this.formData, this.errors);
      }
    }
    return hasErrors;
  }
}
