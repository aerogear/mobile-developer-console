import React, { Component } from 'react';
import { Row, Col } from 'patternfly-react';
import ComponentLabel from './ComponentLabel';

const titleStyle = {
  display: 'inline-block',
  marginRight: 40,
  width: 100
};

class BuildConfig extends Component {
  render() {
    return (
      <div>
        <ComponentLabel>
          Build Config
        </ComponentLabel>
        <Row>
          <Col sm={12} md={12} lg={6}>
            <b style={titleStyle}>Repo Url:</b>
            <span>{this.props.repoUrl}</span>
          </Col>
          <Col sm={12} md={12} lg={6}>
            <b style={titleStyle}>Branch:</b>
            <span>{this.props.branch}</span>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={6}>
            <b style={titleStyle}>Build Platform:</b>
            <span>{this.props.platform}</span>
          </Col>
          <Col sm={12} md={12} lg={6}>
            <b style={titleStyle}>Jenkinsfile Path:</b>
            <span>{this.props.jenkinsfilePath}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BuildConfig;
