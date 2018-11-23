/* eslint class-methods-use-this: off */
import { AbstractBindingValidator } from './AbstractBindingValidator';

export class AndroidUPSBindingValidator extends AbstractBindingValidator {
  constructor({ errorField, platformDetector, preValidate, postValidate }) {
    super({ errorField, platformDetector, preValidate, postValidate, platform: 'Android' });
  }

  validateField(key, value) {
    switch (key) {
      case 'googlekey':
        if (!value) {
          return 'FCM requires a Server Key.';
        }
        break;
      case 'projectNumber':
        if (!value) {
          return 'FCM requires a Sender ID.';
        }
        break;
      default:
        break;
    }
    return null;
  }
}
