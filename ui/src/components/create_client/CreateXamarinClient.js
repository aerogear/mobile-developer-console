import { renderForm } from './CreateClientFormUtils';
import BaseCreateMobileClient from './BaseCreateMobileClient';

/**
 * Component for the Xamarin specific create mobile client form.
 */
class CreateXamarinClient extends BaseCreateMobileClient {
  render() {
    const formFields = this.getFormFields().map(value => {
      if (value.controlId === 'appIdentifier') {
        value.content = 'Enter package name (like <em>AeroGear.Xamarin.MyApp</em>)';
      }
      return value;
    });
    return renderForm('Configure Xamarin app', formFields);
  }
}

export default CreateXamarinClient;
