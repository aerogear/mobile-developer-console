import React, { Component } from 'react';
import { connect } from 'react-redux';

import MobileClientCardView from '../components/overview/MobileClientCardView';
import CreateClient from './CreateClient';
import { fetchApps } from '../actions/apps';
import { fetchServices } from '../actions/services';
import DataService from '../DataService';

class Overview extends Component {
  componentDidMount() {
    this.props.fetchApps();
    this.props.fetchServices();

    this.wsApps = DataService.watchApps(this.props.fetchApps);
    this.wsServices = DataService.watchServices(this.props.fetchServices);
  }

  componentWillUnmount() {
    this.wsApps.close();
    this.wsServices.close();
  }

  render() {
    const { apps, services } = this.props;

    return (
      <MobileClientCardView
        mobileClients={apps.items}
        mobileServiceInstances={services.items}
        mobileClientBuilds={[]}
      >
        <CreateClient />
      </MobileClientCardView>
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps,
    services: state.services,
  };
}

const mapDispatchToProps = {
  fetchApps,
  fetchServices,
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
