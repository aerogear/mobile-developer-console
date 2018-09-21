import React, { Component } from 'react';
import { Button } from 'patternfly-react';

import './NoBuild.css';

class NoBuild extends Component {
    render = () => {
      return (
        <div className="no-builds-note">
          <h2>No Builds</h2>
          <p>No builds exist for {this.props.buildConfigName}</p>
          <Button>Start Build</Button>
        </div>
      );
    }
}

export default NoBuild;
