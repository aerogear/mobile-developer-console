import React from 'react';
import StartBuildButton from '../../containers/StartBuildButton';

import './NoBuild.css';

const NoBuild = ({ buildConfig }) => (
  <div className="no-builds-note">
    <h2>No Builds</h2>
    <p>
      No builds exist for
      {buildConfig.jobName}
    </p>
    <StartBuildButton jobName={buildConfig.jobName} />
  </div>
);

export default NoBuild;
