/* eslint class-methods-use-this: off */
import { AbstractBindingValidator } from './AbstractBindingValidator';

export class IOSUPSBindingValidator extends AbstractBindingValidator {
  constructor(customProperties) {
    super('IOS', customProperties);
  }

  validateField(key, value) {
    switch (key) {
      case 'cert':
        if (!value) {
          return 'APNS requires a certificate.';
        }
        break;
      case 'passphrase':
        if (!value) {
          return 'APNS certificate passphrase is required.';
        }
        break;
      default:
        break;
    }
    return null;
  }
}
