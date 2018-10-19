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
    this.config.appIdentifier.label = '* Bundle ID';
    this.config.appIdentifier.example = 'org.aerogear.ios.myapp';
    this.config.appIdentifier.help = 'Bundle ID must match ^[\\w-]+$';
  }
}

export default CreateIOSClient;