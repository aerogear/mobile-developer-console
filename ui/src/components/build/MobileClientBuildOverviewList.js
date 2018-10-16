import React from 'react';
import { ListView } from 'patternfly-react';
import MobileClientBuildListItem from './MobileClientBuildListItem';
import NoBuildConfig from './NoBuildConfig';

export const MobileClientBuildOverviewList = ({ buildConfigs, appName, clientId, clientType }) => (
  <div>
    {// TODO: Mobile builds are not avaialble for Xamarin.
    buildConfigs.length === 0 ? (
      <NoBuildConfig clientId={clientId} clientType={clientType} />
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
