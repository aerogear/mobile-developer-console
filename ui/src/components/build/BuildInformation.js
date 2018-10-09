import React from 'react';
import { Col } from 'patternfly-react';

import BuildDownload from '../../containers/BuildDownload';
import BuildSummary from './BuildSummary';
import BuildPipeLineStage from './BuildPipelineStage';

import './BuildInformation.css';

const BuildInformation = ({ build, appName }) => (
  <div className="build-information">
    <div className="latest-mobile-build">
      <Col className="latest-build-pipeline" md={10}>
        <div className="build-pipeline">
          <BuildSummary build={build} />
          <div className="pipeline-container">
            <div className="pipeline">
              <BuildPipeLineStage build={build} />
            </div>
          </div>
        </div>
      </Col>
      <Col className="latest-download-trigger" md={2}>
        <BuildDownload appName={appName} build={build} />
      </Col>
    </div>
  </div>
);

export default BuildInformation;
