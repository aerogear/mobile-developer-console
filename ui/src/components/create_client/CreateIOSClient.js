import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_IOS,
} from './Constants';

/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends CreateMobileClientBaseClass {
  constructor() {
    super(PLATFORM_IOS);
  }
}

export default CreateIOSClient;