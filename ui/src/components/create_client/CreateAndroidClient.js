import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_ANDROID,
} from './Constants';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends CreateMobileClientBaseClass {
  constructor() {
    super(PLATFORM_ANDROID);
    this.config.appIdentifier.help = 'Enter package name (like <em>org.aerogear.android.myapp</em>)';
  }
}

export default CreateAndroidClient;
