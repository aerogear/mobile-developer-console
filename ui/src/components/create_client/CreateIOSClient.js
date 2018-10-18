import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_IOS,
} from './Constants';

/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.label = '* Bundle ID';
    this.config.appIdentifier.help = 'Enter bundle ID (like <em>org.aerogear.ios.myapp</em>)';
    this.config.platform = PLATFORM_IOS;
  }
}

export default CreateIOSClient;