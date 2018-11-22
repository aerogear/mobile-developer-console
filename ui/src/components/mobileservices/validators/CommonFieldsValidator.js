/* eslint class-methods-use-this: off */
import { AbstractBindingValidator } from './AbstractBindingValidator';

export class CommonFieldsValidator extends AbstractBindingValidator {
  validateField(key, value) {
    switch (key) {
      case 'CLIENT_ID':
      case 'CLIENT_TYPE':
        if (!value) {
          return `${key} is a required field.`;
        }
        break;
      default:
        break;
    }
    return null;
  }
}
