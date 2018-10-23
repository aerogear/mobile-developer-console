import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import { PLATFORM_ANDROID } from './Constants';
import { connect } from 'react-redux';
import { setStatus, setFieldValue } from '../../actions/apps';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends CreateMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_ANDROID, props);
    this.config.appIdentifier.example = 'org.aerogear.android.myapp';
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateAndroidClient);