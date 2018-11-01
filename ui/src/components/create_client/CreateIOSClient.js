import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { PLATFORM_IOS } from './Constants';
import { connect } from 'react-redux';
import { setStatus, setFieldValue } from '../../actions/apps';

/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends EditMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_IOS, props);
    this.config.appIdentifier.label = '* Bundle ID';
    this.config.appIdentifier.example = 'org.aerogear.ios.myapp';
    this.config.appIdentifier.help = 'Bundle ID must have at least two segments, start with a letter and contain only letters, dots, numbers and _.';
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