import { connect } from 'react-redux';
import '../components/create_client/create_client.css';
import ClientEditBaseClass from './ClientEditBaseClass';
import { createApp, registerPlatform, selectPlatform, resetForm, editApp } from '../actions/apps';

class CreateClient extends ClientEditBaseClass {
  constructor(props) {
    super(props, false);
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps
  };
}

const mapDispatchToProps = {
  createApp,
  registerPlatform,
  selectPlatform,
  resetForm,
  editApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateClient);
