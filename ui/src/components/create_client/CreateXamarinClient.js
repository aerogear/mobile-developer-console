import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';

/**
 * Component for the Xamarin specific create mobile client form.
 */
class CreateXamarinClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.help = 'Enter package name (like <em>AeroGear.Xamarin.MyApp</em>)';
  }
}

export default CreateXamarinClient;
