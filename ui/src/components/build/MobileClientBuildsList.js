import React, { Component } from 'react';
import { ListView } from 'patternfly-react';
import MobileClientBuildListItem from './MobileClientBuildListItem';
import NoBuildConfig from './NoBuildConfig';

class MobileClientBuildOverviewList extends Component {
    render = () => {
      const { buildConfigs, appName } = this.props;

      return (
        <div>
          {
            // TODO: Mobile builds are not avaialble for Xamarin.
            buildConfigs.length === 0
              ? <NoBuildConfig />
              : (
                <ListView>
                  {buildConfigs.map(
                    buildConfig => (
                      <MobileClientBuildListItem
                        appName={appName}
                        key={buildConfig.metadata.name}
                        buildConfiguration={buildConfig}
                      />
                    ),
                  )}
                </ListView>
              )
          }
        </div>
      );
    }
}

export default MobileClientBuildOverviewList;
