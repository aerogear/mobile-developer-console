import React, { Component } from 'react';
import { Grid } from 'patternfly-react';

import MobileClientOverviewList from './MobileClientOverviewList';


const listClientsUrl = `/api/mobileclients`;

class Overview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClients: []
    };
  }

  componentDidMount = () => {
    fetch(listClientsUrl)
      .then(response => response.json())
      .then(result => {
        this.setState({mobileClients: result.items});
      })
      .catch(err => {
        console.error('Fetch error: ', err)
      });
  }

  render() {
    return (
      <Grid fluid>
          <MobileClientOverviewList mobileClients={this.state.mobileClients}></MobileClientOverviewList>
      </Grid>
    );
  }
}

export default Overview;
