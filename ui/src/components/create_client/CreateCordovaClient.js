import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_CORDOVA,
} from './Constants';

/**
 * Component for the Cordova specific create mobile client form.
 */
class CreateCordovaClient extends CreateMobileClientBaseClass {
  constructor() {
    super(PLATFORM_CORDOVA);
    this.config.appIdentifier.example = 'org.aerogear.cordova.myapp';
  }
}

export default CreateCordovaClient;