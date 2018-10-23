import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import { PLATFORM_CORDOVA } from './Constants';
import { connect } from 'react-redux';
import { setStatus, setFieldValue } from '../../actions/apps';

/**
 * Component for the Cordova specific create mobile client form.
 */
class CreateCordovaClient extends CreateMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_CORDOVA, props);
    this.config.appIdentifier.example = 'org.aerogear.cordova.myapp';
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateCordovaClient);