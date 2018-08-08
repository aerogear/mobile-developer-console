import { renderForm} from './CreateClientFormUtils';
import BaseCreateMobileClient from './BaseCreateMobileClient';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends BaseCreateMobileClient {

    render() {
        return renderForm("Configure Android App", this.getFormFields());
    }
}

export default CreateAndroidClient