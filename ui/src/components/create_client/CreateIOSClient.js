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
    this.config.appIdentifier.help = 'Enter bundle ID (like <em>org.aerogear.ios.myapp</em>)';
  }
}

export default CreateIOSClient;