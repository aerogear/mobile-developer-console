import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';

/**
 * Component for the Cordova specific create mobile client form.
 */
class CreateCordovaClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.help = 'Enter package name (like <em>org.aerogear.cordova.myapp</em>)';
  }
}

export default CreateCordovaClient;


