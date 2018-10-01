import React from 'react';
import { ListView } from 'patternfly-react';
import MobileClientListViewItem from './MobileClientListViewItem';

const MobileClientOverviewList = ({
  mobileClients,
  mobileServiceInstances,
  mobileClientBuilds,
}) => (
  <div>
    <ListView>
      {mobileClients.map((mobileClient) => {
        const { uid } = mobileClient.metadata;
        return (
          <MobileClientListViewItem
            key={uid}
            mobileClient={mobileClient}
            mobileServiceInstances={mobileServiceInstances}
            mobileClientBuilds={mobileClientBuilds}
          />
        );
      })}
    </ListView>
  </div>
);

export default MobileClientOverviewList;
