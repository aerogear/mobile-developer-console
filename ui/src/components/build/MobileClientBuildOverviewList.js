import React from 'react';
import { ListView } from 'patternfly-react';
import MobileClientBuildListItem from './MobileClientBuildListItem';
import NoBuildConfig from './NoBuildConfig';

export const MobileClientBuildOverviewList = ({ buildConfigs, appName, clientInfo }) => (
  <div>
    {// TODO: Mobile builds are not avaialble for Xamarin.
    buildConfigs.length === 0 ? (
      <NoBuildConfig clientInfo={clientInfo} />
    ) : (
      <ListView>
        {buildConfigs.map(buildConfig => (
          <MobileClientBuildListItem
            appName={appName}
            key={buildConfig.metadata.name}
            buildConfiguration={buildConfig}
          />
        ))}
      </ListView>
    )}
  </div>
);
