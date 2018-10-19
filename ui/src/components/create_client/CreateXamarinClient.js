import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_XAMARIN,
} from './Constants';

/**
 * Component for the Xamarin specific create mobile client form.
 */
class CreateXamarinClient extends CreateMobileClientBaseClass {
  constructor() {
    super(PLATFORM_XAMARIN);
    this.config.appIdentifier.help = 'Enter package name (like <em>AeroGear.Xamarin.MyApp</em>)';
  }
}

export default CreateXamarinClient;