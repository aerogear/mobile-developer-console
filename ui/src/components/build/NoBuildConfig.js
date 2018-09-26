import React, { Component } from 'react';
import { Button } from 'patternfly-react';

import './NoBuildConfig.css';

class NoBuildConfig extends Component {
  render = () => (
    <div className="note">
      <h2>No Build Config</h2>
      <p>Create a mobile build config to create a mobile client build.</p>
      <Button bsStyle="primary" bsSize="large">
        Create Build
      </Button>
    </div>
  );
}

export default NoBuildConfig;
