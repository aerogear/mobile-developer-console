import React, { Component } from 'react';
import { Row, Col } from 'patternfly-react';
import ComponentLabel from './ComponentLabel';

import './BuildConfig.css';

class BuildConfig extends Component {
  render() {
    return (
      <div className="build-config">
        <ComponentLabel>
          Build Config
        </ComponentLabel>
        <Row>
          <Col lg={6}>
            <b>Repo Url:</b>
            <span>{this.props.repoUrl}</span>
          </Col>
          <Col lg={6}>
            <b>Branch:</b>
            <span>{this.props.branch}</span>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <b>Build Platform:</b>
            <span>{this.props.platform}</span>
          </Col>
          <Col lg={6}>
            <b>Jenkinsfile Path:</b>
            <span>{this.props.jenkinsfilePath}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BuildConfig;
