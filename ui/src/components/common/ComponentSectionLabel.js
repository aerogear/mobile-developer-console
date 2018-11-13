import React, { Component } from 'react';
import './ComponentSectionLabel.css';

class ComponentSectionLabel extends Component {
  render = () => (
    <React.Fragment>
      <div className="component-label section-label">{this.props.children}</div>
    </React.Fragment>
  );
}

export default ComponentSectionLabel;
