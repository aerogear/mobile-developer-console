import React, { Component } from 'react';
import { Col, Button } from 'patternfly-react';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-precise-range-plugin';
import BuildStatus from '../common/BuildStatus';

import './MobileClientBuildHistoryList.css';

class MobileClientBuildHistoryList extends Component {

    render = () => {
      const mobileClientBuilds = Object.values(this.props.mobileClientBuilds || {});
      return (
        <React.Fragment>
          {mobileClientBuilds.map(mobileClientBuild => {
            const phase = mobileClientBuild.status.phase;
            const buildNumber = mobileClientBuild.metadata.annotations['openshift.io/build.number'];
            const durationString = moment.preciseDiff(mobileClientBuild.status.startTimestamp, mobileClientBuild.status.completionTimestamp);
                    
            return (
              <Col xs={12} className="mobile-client-build-history-item" key={mobileClientBuild.metadata.uid}>
                <Col xs={9} sm={10} md={10} className="status-panel">
                  <div className="build-summary">
                    <div>
                      <BuildStatus build={mobileClientBuild} />&nbsp;
                      <a>Build #{buildNumber}</a>
                    </div>
                  </div>
                  <Col md={12} className="state">
                    <Col sm={12} md={7}>
                      <Col md={6}>
                        <div className="info status">{phase}</div>
                        <div className="info logs">
                          <a className="left-margin-link">View log</a>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="info creation build-timestamp">
                          <Moment fromNow>
                            {mobileClientBuild.status.startTimestamp}
                          </Moment>
                        </div>
                      </Col>
                    </Col>
                    <Col sm={12} md={5}>
                      <span>Duration: </span>
                      <span>{durationString}</span>
                    </Col>
                  </Col>
                </Col>
                <Col xs={3} sm={2} md={2} className="download">
                  <Button  bsSize="xsmall">
                                    Download
                  </Button>
                </Col>
              </Col>
            )
          })}
        </React.Fragment>
      );
    }
}

export default MobileClientBuildHistoryList;