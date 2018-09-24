import React, { Component } from 'react';
import { Button } from 'patternfly-react';

import './NoBuildConfig.css';
import CreateClientBuildDialog from './CreateClientBuildDialog';

const createBuildConfig = 'Create build config';
class NoBuildConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBuildDialogDisplayed: false
    };
  }

  createBuild = config => {
    this.setState({ createBuildDialogDisplayed: true });
  };

  buildUpdated = buildConfig => {
    console.log('build updated');
    console.log(buildConfig);
    this.close();
  };

  close = () => {
    this.setState({ createBuildDialogDisplayed: false });
  };

  render = () => {
    const { createBuildDialogDisplayed } = this.state;
    return (
      <div className="note">
        <h2>No Build Config</h2>
        <p>Create a mobile build config to create a mobile client build.</p>
        <Button bsStyle="primary" bsSize="large" onClick={this.createBuild}>
          {createBuildConfig}
        </Button>
        <CreateClientBuildDialog
          show={createBuildDialogDisplayed}
          title={createBuildConfig}
          onSave={this.buildUpdated}
          onCancel={this.close}
        />
      </div>
    );
  };
}

export default NoBuildConfig;
