import React, { Component } from 'react';
import { Button } from 'patternfly-react';
import './NoBuildConfig.css';
import BuildConfigDialog from '../../containers/BuildConfigDialog';

class NoBuildConfig extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  render = () => {
    const { config } = this.props;
    const { show } = this.state;
    return (
      <div className="note">
        <h2>No Build Config</h2>
        <p>Create a mobile build config to create a mobile client build.</p>
        <Button bsStyle="primary" bsSize="large" onClick={() => this.setState({ show: true })}>
          Create build config
        </Button>
        {
          <BuildConfigDialog
            update={false}
            initialConfig={config}
            show={show}
            onShowStateChanged={isShown => this.setState({ show: isShown })}
          />
        }
      </div>
    );
  };
}

export default NoBuildConfig;
