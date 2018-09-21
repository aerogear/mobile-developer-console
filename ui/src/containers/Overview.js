import React, { Component } from 'react';
import { Grid } from 'patternfly-react';
import { connect } from 'react-redux';

import MobileClientOverviewList from '../components/overview/MobileClientOverviewList';
import CreateClient from './CreateClient';
import { fetchApps } from '../actions/apps';
import { fetchServices } from '../actions/services';

class Overview extends Component {
  componentDidMount() {
    this.props.dispatch(fetchApps());
    this.props.dispatch(fetchServices());
  }

  render() {
    const { apps, services } = this.props;

    return (
      <Grid fluid>
        <MobileClientOverviewList
          mobileClients={apps.items}
          mobileServiceInstances={services.items}
          mobileClientBuilds={[]}
        />
        <CreateClient />
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps,
    services: state.services,
  };
}

export default connect(mapStateToProps)(Overview);
