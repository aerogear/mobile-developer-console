import { connect } from 'react-redux';
import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { PLATFORM_XAMARIN } from './Constants';
import { setFieldValue, editApp } from '../../actions/apps';

export const EXAMPLE_APPIDENTIFIER = 'AeroGear.Xamarin.MyApp';

/**
 * Component for the Xamarin specific create mobile client form.
 */
class CreateXamarinClient extends EditMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_XAMARIN, props);
    this.config.appIdentifier.example = EXAMPLE_APPIDENTIFIER;
  }
}

function mapStateToProps(state) {
  return {
    ui: state.apps.createClientAppDialog
  };
}

const mapDispatchToProps = {
  setFieldValue,
  editApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateXamarinClient);
