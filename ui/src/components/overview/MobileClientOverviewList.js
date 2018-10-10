import React from 'react';
import { Toolbar, Filter, FormControl } from 'patternfly-react';
import MobileClientListViewItem from './MobileClientListViewItem';

const MobileClientOverviewList = ({
  mobileClients,
  mobileServiceInstances,
  mobileClientBuilds,
}) => (
  <Toolbar>
    <Filter>
    <FormControl type="text" placeholder="Filter by name"></FormControl>
    </Filter>
  </Toolbar>
);

export default MobileClientOverviewList;
