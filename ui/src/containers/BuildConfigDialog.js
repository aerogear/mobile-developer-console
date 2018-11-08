import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateBuildConfigDialog from '../components/build/CreateBuildConfigDialog';
import { createBuildConfig } from '../actions/buildConfigs';
import { KEY_CR_CLIENT_ID, KEY_CR_CLIENT_TYPE } from '../components/build/Constants';

class BuildConfigDialog extends Component {
  buildConfigCreated = createBuildConfigState => {
    const config = Object.assign({}, createBuildConfigState.config);
    const { clientId, clientType } = this.props.clientInfo;
    config[KEY_CR_CLIENT_ID] = clientId;
    config[KEY_CR_CLIENT_TYPE] = clientType;
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
    const { show } = this.props;
    return (
      <CreateBuildConfigDialog
        show={show}
        title="Create build config"
        onSave={this.buildConfigCreated}
        onCancel={this.close}
      />
    );
  };
}

const mapDispatchToProps = {
  createBuildConfig
};

export default connect(
  null,
  mapDispatchToProps
)(BuildConfigDialog);
