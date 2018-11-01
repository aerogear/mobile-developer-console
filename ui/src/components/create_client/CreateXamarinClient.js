import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { PLATFORM_XAMARIN } from './Constants';
import { connect } from 'react-redux';
import { setStatus, setFieldValue } from '../../actions/apps';

/**
 * Component for the Xamarin specific create mobile client form.
 */
class CreateXamarinClient extends EditMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_XAMARIN, props);
    this.config.appIdentifier.example = 'AeroGear.Xamarin.MyApp';
  }
}

function mapStateToProps(state) {
  return {
    ui: state.apps.createClientAppDialog,
  };
}

const mapDispatchToProps = {
  setStatus,
  setFieldValue,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateXamarinClient);