import React, { Component } from 'react';

import './ComponentLabel.css';

class ComponentLabel extends Component {
  render() {
    return (
      <div className="component-label">
        {this.props.children}
      </div>
    );
  }
}

export default ComponentLabel;
