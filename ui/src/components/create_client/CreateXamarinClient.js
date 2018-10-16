import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import {
  PLATFORM_XAMARIN,
} from './Constants';

/**
 * Component for the Xamarin specific create mobile client form.
 */
class CreateXamarinClient extends CreateMobileClientBaseClass {
  constructor() {
    super();
    this.config.appIdentifier.help = 'Enter package name (like <em>AeroGear.Xamarin.MyApp</em>)';
    this.config.platform = PLATFORM_XAMARIN;
  }
}

export default CreateXamarinClient;