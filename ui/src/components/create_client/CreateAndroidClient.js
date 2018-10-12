import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.help = 'Enter package name (like <em>org.aerogear.android.myapp</em>)';
  }
}

export default CreateAndroidClient;
