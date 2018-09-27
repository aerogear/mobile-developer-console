import React, { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import './BuildPipelineStage.css';

momentDurationFormatSetup(moment);

const getIcon = (status) => {
  switch (status) {
    case 'SUCCESS':
      return <span className="fa fa-check-circle fa-fw" aria-hidden="true" style={{ color: '#3f9c35' }} />;
    case 'FAILED':
      return <span className="fa fa-times-circle fa-fw" aria-hidden="true" style={{ color: '#c00' }} />;
    case 'IN_PROGRESS':
      return <span className="fa fa-play-circle fa-fw" aria-hidden="true" style={{ color: '#0088ce' }} />;
    default:
      return null;
  }
};

class BuildPipelineStage extends Component {
  // TODO: add webhook or poll end point to set pipeline stages
  render() {
    let stages;
    try {
      const status = JSON.parse(this.props.build.metadata.annotations['openshift.io/jenkins-status-json']);
      stages = status.stages;
    } catch (error) {
      stages = [];
    }
    
    return (
      <React.Fragment>
        {
          stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div className="pipeline-stage">
                <div className="pipeline-stage-column">
                  <div className="pipeline-stage-name">
                    {stage.name}
                  </div>

                  <div className={`pipeline-status-bar ${stage.status}`}>
                    <div className="pipeline-line" />
                    <div className="pipeline-circle">
                      <div className="pipeline-circle-bg" />
                      { getIcon(stage.status) }
                    </div>
                  </div>
                  
                  <div className="pipeline-time">
                    {moment.duration(stage.durationMillis).format('h[h] m[m] s[s]')}
                  </div>
                </div>
              </div>
              <div className="pipeline-arrow">
                {
                  index < stages.length - 1 && (
                    <span className="fa fa-arrow-right fa-fw" aria-hidden="true" />
                  )
                }
              </div>
            </React.Fragment>
          ))
        }
      </React.Fragment>
    );
  }
}

export default BuildPipelineStage;
