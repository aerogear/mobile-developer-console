import React, { Component } from 'react';
import { ListView } from 'patternfly-react';
import MobileClientListViewItem from './MobileClientListViewItem';


class MobileClientOverviewList extends Component {
    render = () => {
      const { mobileClients, mobileServiceInstances, mobileClientBuilds } = this.props;

      return (
        <div>
          <ListView>
            {mobileClients.map(mobileClient => (
              <MobileClientListViewItem
                key={mobileClient.metadata.name}
                mobileClient={mobileClient}
                mobileServiceInstances={mobileServiceInstances}
                mobileClientBuilds={mobileClientBuilds}
              />
            ))
            }
          </ListView>
        </div>
      );
    }
}

export default MobileClientOverviewList;
