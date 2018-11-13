import { connect } from 'react-redux';
import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { PLATFORM_ANDROID } from './Constants';
import { setFieldValue, editApp } from '../../actions/apps';

export const EXAMPLE_APPIDENTIFIER = 'org.aerogear.android.myapp';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends EditMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_ANDROID, props);
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
)(CreateAndroidClient);
