import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateBuildConfigDialog from '../components/build/CreateBuildConfigDialog';
import { createBuildConfig } from '../actions/buildConfigs';

class BuildConfigDialog extends Component {
  buildUpdated = configUpdate => {
    const config = Object.assign({}, configUpdate.config);
    this.props.createBuildConfig(config);
    this.close();
  };

  showCreateDialog = () => {
    this.callOnShowStateChanged(true);
  };

  callOnShowStateChanged = show => {
    const { onShowStateChanged } = this.props;
    onShowStateChanged && onShowStateChanged(show);
  };

  close = () => {
    this.callOnShowStateChanged(false);
  };

  render = () => {
    const { update, initialConfig, show } = this.props;
    return (
      <CreateBuildConfigDialog
        initialConfig={initialConfig}
        show={show}
        title={update ? 'Edit build config' : 'Create build config'}
        onSave={this.buildUpdated}
        onCancel={this.close}
      />
    );
  };
}

function mapStateToProps(state) {
  return {
    config: state
  };
}

const mapDispatchToProps = {
  createBuildConfig
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BuildConfigDialog);
