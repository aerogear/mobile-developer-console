import { connect } from 'react-redux';
import EditMobileClientBaseClass from './EditMobileClientBaseClass';
import { setFieldValue, editApp } from '../../actions/apps';

/**
 * Component for the create mobile client form.
 */
export class CreateClient extends EditMobileClientBaseClass {}

function mapStateToProps(state) {
  return {
    ui: state.createClientAppDialog
  };
}

const mapDispatchToProps = {
  setFieldValue,
  editApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateClient);
