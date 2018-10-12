import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';

/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.label = '* Bundle ID';
    this.config.appIdentifier.help = 'Enter bundle ID (like <em>org.aerogear.ios.myapp</em>)';
  }
}

export default CreateIOSClient;
