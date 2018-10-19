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
    this.config.appIdentifier.example = 'AeroGear.Xamarin.MyApp';
  }
}

export default CreateXamarinClient;