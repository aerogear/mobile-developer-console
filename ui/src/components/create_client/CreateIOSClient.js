import CreateMobileClientBaseClass from './CreateMobileClientBaseClass';
import { PLATFORM_IOS } from './Constants';
import { connect } from 'react-redux';
import { setStatus, setFieldValue } from '../../actions/apps';

/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends CreateMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_IOS, props);
    this.config.appIdentifier.label = '* Bundle ID';
    this.config.appIdentifier.example = 'org.aerogear.ios.myapp';
    this.config.appIdentifier.help = 'Bundle ID must match ^[a-zA-Z][\\w]*(\\.[a-zA-Z][\\w]*)+$';
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateIOSClient);