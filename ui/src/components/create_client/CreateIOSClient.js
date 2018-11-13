import { connect } from 'react-redux';
import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { PLATFORM_IOS } from './Constants';
import { setFieldValue, editApp } from '../../actions/apps';

export const LABEL_APPID = '* Bundle ID';
export const EXAMPLE_APPID = 'org.aerogear.ios.myapp';
export const HELP_APPID =
  'Bundle ID must have at least two segments, start with a letter and contain only letters, dots, numbers and _.';
/**
 * Component for the iOS specific create mobile client form.
 */
class CreateIOSClient extends EditMobileClientBaseClass {
  constructor(props) {
    super(PLATFORM_IOS, props);
    this.config.appIdentifier.label = LABEL_APPID;
    this.config.appIdentifier.example = EXAMPLE_APPID;
    this.config.appIdentifier.help = HELP_APPID;
  }
}

function mapStateToProps(state) {
  return {
    ui: state.apps.createClientAppDialog
  };
}

const mapDispatchToProps = {
  setFieldValue
  editApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateIOSClient);
