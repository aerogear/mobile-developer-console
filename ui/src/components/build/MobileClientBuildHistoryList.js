import React from 'react';
import { Col } from 'patternfly-react';
import Moment from 'react-moment';
import moment from 'moment';
import BuildStatus from '../common/BuildStatus';
import Duration from './Duration';
import BuildDownload from '../../containers/BuildDownload';

import './MobileClientBuildHistoryList.css';

const MobileClientBuildHistoryList = props => {
  const mobileClientBuilds = Object.values(props.mobileClientBuilds || {});
  return (
    <React.Fragment>
      {mobileClientBuilds.map(mobileClientBuild => {
        const {
          status: { phase, startTimestamp, completionTimestamp },
          metadata: {
            annotations: {
              'openshift.io/build.number': buildNumber,
              'openshift.io/jenkins-console-log-url': jenkinsConsoleLogUrl
            },
            uid
          },
          buildUrl
        } = mobileClientBuild;

        const duration = moment(completionTimestamp).valueOf() - moment(startTimestamp).valueOf();

        return (
          <Col xs={12} className="mobile-client-build-history-item" key={uid}>
            <Col xs={8} sm={9} md={9} className="status-panel">
              <div className="build-summary">
                <div>
                  <BuildStatus build={mobileClientBuild} />
                  &nbsp;
                  <a href={buildUrl}>Build #{buildNumber}</a>
                </div>
              </div>
              <Col md={12} className="state">
                <Col sm={12} md={7}>
                  <Col md={6}>
                    <div className="info status">{phase}</div>
                    <div className="info logs">
                      <a href={jenkinsConsoleLogUrl} className="left-margin-link">
                        View log
                      </a>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="info creation build-timestamp">
                      <Moment fromNow>{startTimestamp}</Moment>
                    </div>
                  </Col>
                </Col>
                <Col sm={12} md={5}>
                  <span>Duration: </span>
                  <span>
                    <Duration duration={duration} inProgress={phase === 'Running'} />
                  </span>
                </Col>
              </Col>
            </Col>
            <Col xs={4} sm={3} md={3} className="download">
              <BuildDownload history build={mobileClientBuild} appName={props.appName} />
            </Col>
          </Col>
        );
      })}
    </React.Fragment>
  );
};

export default MobileClientBuildHistoryList;
