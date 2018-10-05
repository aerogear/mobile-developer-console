import React from 'react';
import { ListView } from 'patternfly-react';
import MobileClientBuildListItem from './MobileClientBuildListItem';
import NoBuildConfig from './NoBuildConfig';

const MobileClientBuildOverviewList = ({ buildConfigs, clientId }) => (
  <div>
    {
            // TODO: Mobile builds are not avaialble for Xamarin.
            buildConfigs.length === 0
              ? <NoBuildConfig clientId={clientId} />
              : (
                <ListView>
                  {buildConfigs.map(buildConfig => (
                    <MobileClientBuildListItem
                      key={buildConfig.metadata.name}
                      buildConfiguration={buildConfig}
                      clientId={clientId}
                    />
                  ))}
                </ListView>
              )
          }
  </div>
);
export default MobileClientBuildOverviewList;
