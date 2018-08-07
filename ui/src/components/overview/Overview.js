import React, { Component } from 'react';
import { Grid } from 'patternfly-react';

import MobileClientOverviewList from './MobileClientOverviewList';
import DataService from '../../DataService';
import CreateClient from '../create_client/CreateClient'

class Overview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClients: [],
      mobileServiceInstances: [],
      mobileClientBuilds: []
    };
  }


  fetchData = () => {
    this.getMobileClients();
    this.getMobileServiceInstances();
    this.getMobileClientBuilds();
  }

  componentDidMount = () => {
    this.fetchData()
  }

  getMobileClients = () => {
    DataService
      .mobileClients()
      .then(mobileClients => {
        this.setState({mobileClients});
      })
      .catch(err => {
        // TODO: Error Notifications
        console.error('Fetch error: ', err);
      });
  }

  getMobileServiceInstances = () => {
    DataService
      .serviceInstances()
      .then(mobileServiceInstances => {
        this.setState({mobileServiceInstances});
      })
      .catch(err => {
        // TODO: Error Notifications
        console.error('Fetch error: ', err);
      });
  }

  getMobileClientBuilds = () => {
    DataService
      .builds()
      .then(mobileClientBuilds => {
        this.setState({mobileClientBuilds});
      })
      .catch(err => {
        // TODO: Error Notifications
        console.error('Fetch error: ', err);
      });
  }

  componentDidMount = () => {
    this.fetchData();
  }

  clientCreated= (result) => {
    this.fetchData();
  }

  render() {
    const {mobileClients, mobileServiceInstances, mobileClientBuilds} = this.state;

    return (
      <Grid fluid>
          <MobileClientOverviewList
            mobileClients={mobileClients}
            mobileServiceInstances={mobileServiceInstances}
            mobileClientBuilds={mobileClientBuilds}></MobileClientOverviewList>
        <MobileClientOverviewList mobileClients={this.state.mobileClients}></MobileClientOverviewList>
        <CreateClient clientCreated={this.clientCreated}/>
      </Grid>
    );
  }
}

export default Overview;
