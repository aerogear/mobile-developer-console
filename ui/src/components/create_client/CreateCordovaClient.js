import { renderForm } from './CreateClientFormUtils';
import BaseCreateMobileClient from './BaseCreateMobileClient';

/**
 * Component for the Cordova specific create mobile client form.
 */
class CreateCordovaClient extends BaseCreateMobileClient {
  render() {
    const formFields = this.getFormFields().map(value => {
      if (value.controlId === 'appIdentifier') {
        value.content = 'Enter package name (like <em>org.aerogear.cordova.myapp</em>)';
      }
      return value;
    });
    return renderForm('Configure Cordova app', formFields);
  }
}

export default CreateCordovaClient;
