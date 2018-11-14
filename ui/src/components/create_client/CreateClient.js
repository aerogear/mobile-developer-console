import { connect } from 'react-redux';
import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { setFieldValue, editApp } from '../../actions/apps';

export const EXAMPLE_APPIDENTIFIER = 'org.aerogear.myapp';

/**
 * Component for the create mobile client form.
 */
export class CreateClient extends EditMobileClientBaseClass {
  constructor(props) {
    super(props);
    this.config.appIdentifier.example = EXAMPLE_APPIDENTIFIER;
  }
}

function mapStateToProps(state) {
  return {
    ui: state.apps.createClientAppDialog,
  };
}

const mapDispatchToProps = {
  setFieldValue,
  editApp
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateClient);