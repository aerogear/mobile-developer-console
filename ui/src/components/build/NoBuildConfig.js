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
    const { show } = this.state;
    const { clientInfo } = this.props;
    return (
      <div className="note">
        <h2>No Build Config</h2>
        <p>Create a mobile build config to create a mobile client build.</p>
        <Button bsStyle="primary" bsSize="large" onClick={() => this.setState({ show: true })}>
          Create build config
        </Button>
        {
          <BuildConfigDialog
            show={show}
            clientInfo={clientInfo}
            onShowStateChanged={isShown => this.setState({ show: isShown })}
          />
        }
      </div>
    );
  };
}

export default NoBuildConfig;
