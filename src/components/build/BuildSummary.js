import React from 'react';
import Moment from 'react-moment';
import BuildStatus from '../common/BuildStatus';

import './BuildSummary.css';

const BuildSummary = props => {
  const {
    build,
    build: {
      buildUrl,
      metadata: {
        annotations: {
          'openshift.io/jenkins-console-log-url': jenkinsConsoleLogUrl,
          'openshift.io/build.number': buildNumber
        }
      },
      status: { startTimestamp }
    }
  } = props;

  return (
    <div className="build-summary-container">
      <div className="build-phase">
        <BuildStatus build={build} /> &nbsp;
        <a href={buildUrl}>Build #{buildNumber}</a>
      </div>
      <div className="build-timestamp">
        <Moment fromNow>{startTimestamp}</Moment>
      </div>
      <div className="build-links">
        <a href={jenkinsConsoleLogUrl}>View log</a>
      </div>
    </div>
  );
};

export default BuildSummary;
