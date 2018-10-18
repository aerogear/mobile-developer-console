import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_CORDOVA,
} from './Constants';

/**
 * Component for the Cordova specific create mobile client form.
 */
class CreateCordovaClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.help = 'Enter package name (like <em>org.aerogear.cordova.myapp</em>)';
    this.config.platform = PLATFORM_CORDOVA;
  }
}

export default CreateCordovaClient;