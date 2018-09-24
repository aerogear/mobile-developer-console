import React, { Component } from 'react';
import Moment from 'react-moment';

import BuildStatus from '../common/BuildStatus';

import './BuildPipelineStage.css';

class BuildPipelineStage extends Component {
  // TODO: add webhook or poll end point to set pipeline stages
  render() {
    return (
      <div className="pipeline-stage">
        <div className="pipeline-stage-name">
          <b>Status : </b>
          {' '}
          {this.props.build.status.phase}
        </div>
        <div className="pipeline-stage-icon">
          <BuildStatus build={this.props.build} />
        </div>
        <div className="pipeline-stage-time">
          <p>
            <Moment diff={this.props.build.status.startTimestamp} unit="minutes">{this.props.build.status.completionTimestamp}</Moment>
m
          </p>
        </div>
      </div>
    );
  }
}

export default BuildPipelineStage;
