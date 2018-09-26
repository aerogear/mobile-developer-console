import { renderForm } from './CreateClientFormUtils';
import BaseCreateMobileClient from './BaseCreateMobileClient';

/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends BaseCreateMobileClient {
  render() {
    const formFields = this.getFormFields().map(value => {
      if (value.controlId === 'appIdentifier') {
        value.label = '* Bundle ID';
        value.content = 'Enter bundle ID (like <em>org.aerogear.ios.myapp</em>)';
      }
      return value;
    });
    return renderForm('Configure iOS app', formFields);
  }
}

export default CreateIOSClient;
