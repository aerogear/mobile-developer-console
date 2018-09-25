import React, { Component } from 'react';
import { Button, Col } from 'patternfly-react';

import BuildDownloadLinks from './BuildDownloadLinks';
import BuildSummary from './BuildSummary';
import BuildPipeLineStage from './BuildPipelineStage';

import './BuildInformation.css';

class BuildInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLinks: false,
      buildSuccessfull: true
    };
  }

  handleDownload() {
    this.setState(prevState => ({
      toggleLinks: !prevState.toggleLinks
    }));
  }

  renderDownloadButton() {
    if (this.props.build.status.phase === 'Complete') {
      return (
        <Button bsStyle="primary" onClick={this.handleDownload.bind(this)}>
          Download
        </Button>
      );
    }
    return null;
  }

  renderDownloadDialog() {
    if (this.state.toggleLinks) {
      return (
        <BuildDownloadLinks
          downloadURL={this.props.build.metadata.annotations['aerogear.org/download-mobile-artifact-url'] || ''}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <div className="build-information">
        <div className="latest-mobile-build">
          <Col className="latest-build-pipeline" md={10}>
            <div className="build-pipeline">
              <BuildSummary build={this.props.build} />
              <div className="pipeline-container">
                <div className="pipeline">
                  <BuildPipeLineStage build={this.props.build} />
                </div>
              </div>
            </div>
          </Col>
          <Col className="latest-download-trigger" md={2}>
            {this.renderDownloadButton()}
          </Col>
        </div>
        {this.renderDownloadDialog()}
      </div>
    );
  }
}

export default BuildInformation;
