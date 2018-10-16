import React, { Component } from 'react';
import { Button } from 'patternfly-react';
import { connect } from 'react-redux';
import { createBuildConfig } from '../../actions/buildConfigs';
import './NoBuildConfig.css';
import CreateBuildConfigDialog from './CreateBuildConfigDialog';

const createBuildConfigTitle = 'Create build config';
class NoBuildConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBuildDialogDisplayed: false
    };
  }

  buildUpdated = configUpdate => {
    console.log('build updated');
    // TODO remove hardcoded values and use values from app config
    const config = Object.assign({ clientId: 'org.aerogear.app', clientType: 'android' }, configUpdate.config);
    this.props.createBuildConfig(config);
    this.close();
  };

  close = () => {
    this.setState({ createBuildDialogDisplayed: false });
  };

  render = () => {
    const { createBuildDialogDisplayed } = this.state;
    const config = { clientId: this.props.clientId, clientType: this.props.clientType };
    return (
      <div className="note">
        <h2>No Build Config</h2>
        <p>Create a mobile build config to create a mobile client build.</p>
        <Button bsStyle="primary" bsSize="large" onClick={() => this.setState({ createBuildDialogDisplayed: true })}>
          {createBuildConfigTitle}
        </Button>
        <CreateBuildConfigDialog
          config={config}
          show={createBuildDialogDisplayed}
          title={createBuildConfigTitle}
          onSave={this.buildUpdated}
          onCancel={this.close}
        />
      </div>
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
)(NoBuildConfig);
