import React, { Component } from 'react';
import { ListView } from 'patternfly-react';
import MobileClientListViewItem from './MobileClientListViewItem';


class MobileClientOverviewList extends Component {

    render = () => {
      const {mobileClients, mobileServiceInstances, mobileClientBuilds} = this.props;

      return (
        <div>
          <ListView>
            {mobileClients.map(mobileClient => 
              <MobileClientListViewItem
                mobileClient={mobileClient}
                mobileServiceInstances={mobileServiceInstances}
                mobileClientBuilds={mobileClientBuilds}>
              </MobileClientListViewItem>)
            }
          </ListView>
        </div>
      );
    }
}

export default MobileClientOverviewList;
