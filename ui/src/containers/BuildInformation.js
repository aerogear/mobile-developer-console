import React, { Component } from 'react';
import { Button, Col } from 'patternfly-react';
import { connect } from 'react-redux';

import BuildDownloadLinks from '../components/build/BuildDownloadLinks';
import BuildSummary from '../components/build/BuildSummary';
import BuildPipeLineStage from '../components/build/BuildPipelineStage';
import { generateDownloadURL } from '../actions/builds';

import '../components/build/BuildInformation.css';


class BuildInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleLinks: false,
      buildSuccessfull: true,
    };
  }

  handleDownload() {
    if (!this.props.build.metadata.annotations['aerogear.org/download-mobile-artifact']) {
      this.props.generateDownloadURL(this.props.build.metadata.name);
    }
    this.setState(prevState => ({
      toggleLinks: !prevState.toggleLinks,
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
      return <BuildDownloadLinks downloadURL={this.props.build.metadata.annotations['aerogear.org/download-mobile-artifact-url'] || ''} />;
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

const mapDispatchToProps = {
  generateDownloadURL
};

export default connect(null, mapDispatchToProps)(BuildInformation);