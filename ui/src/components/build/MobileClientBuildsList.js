import React, { Component } from 'react';
import { ListView } from 'patternfly-react';
import MobileClientBuildListItem from './MobileClientBuildListItem';


class MobileClientBuildOverviewList extends Component {
    render = () => {
        const {mobileClientBuilds} = this.props;

        return (
            <div>
                <ListView>
                  {mobileClientBuilds.map(
                      mobileClientBuild => (
                          <MobileClientBuildListItem mobileClientBuild={mobileClientBuild}></MobileClientBuildListItem>
                      )
                  )}
                </ListView>
            </div>
        );
    }
}

export default MobileClientBuildOverviewList;
