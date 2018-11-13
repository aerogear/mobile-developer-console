import React, { Component } from 'react';
import { Row, Col } from 'patternfly-react';

import './BuildConfigDetails.css';

class BuildConfigDetails extends Component {
  render() {
    const { repoUrl, branch, jobName, jenkinsfilePath } = this.props.buildConfig;

    return (
      <div className="build-config">
        <Row>
          <Col md={6}>
            <b>Repo Url:</b>
            <a href={repoUrl}>{repoUrl}</a>
          </Col>
          <Col md={6}>
            <b>Branch:</b>
            <span>{branch}</span>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <b>Jenkins Job Name:</b>
            <span>{jobName}</span>
          </Col>
          <Col md={6}>
            <b>Jenkinsfile Path:</b>
            <span>{jenkinsfilePath}</span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default BuildConfigDetails;
