import React from 'react';
import { MenuItem } from 'patternfly-react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { deleteApp, fetchApp, updateApp, editApp } from '../actions/apps';
import { deleteBuildConfig } from '../actions/buildConfigs';
import ClientEditBaseClass from './ClientEditBaseClass';

class EditItemButton extends ClientEditBaseClass {
  constructor(props) {
    super(props, true);
  }

  render() {
    return (
      <Route
        render={props => (
          <React.Fragment>
            <MenuItem onClick={this.open}>Edit</MenuItem>
            {this.renderModal()}
          </React.Fragment>
        )}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps
  };
}

const mapDispatchToProps = {
  editApp,
  deleteApp,
  deleteBuildConfig,
  fetchApp,
  updateApp
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditItemButton);
