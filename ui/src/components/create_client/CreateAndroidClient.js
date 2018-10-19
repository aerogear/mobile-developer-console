import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import { PLATFORM_ANDROID } from './Constants';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends CreateMobileClientBaseClass {
  constructor() {
    super(PLATFORM_ANDROID);
    this.config.appIdentifier.example = 'org.aerogear.android.myapp';
  }
}

export default CreateAndroidClient;
