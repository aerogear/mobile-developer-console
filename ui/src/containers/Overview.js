import React, { Component } from 'react';
import { connect } from 'react-redux';

import MobileClientCardView from '../components/overview/MobileClientCardView';
import { fetchApps } from '../actions/apps';
import { fetchServices } from '../actions/services';
import { fetchBuilds } from '../actions/builds';
import DataService from '../DataService';

class Overview extends Component {
  componentDidMount() {
    this.props.fetchApps();
    this.props.fetchServices();

    this.wsApps = DataService.watchApps(this.props.fetchApps);
    this.wsServices = DataService.watchServices(this.props.fetchServices);

    if (this.props.buildTabEnabled) {
      this.props.fetchBuilds();
      this.wsBuilds = DataService.watchBuilds(this.props.fetchBuilds);
    }
  }

  componentWillUnmount() {
    this.wsApps.close();
    this.wsServices.close();
    if (this.wsBuilds) {
      this.wsBuilds.close();
    }
  }

  render() {
    const { apps, services, builds, buildTabEnabled } = this.props;

    return (
      <MobileClientCardView
        mobileClients={apps.items}
        mobileServiceInstances={services.items}
        mobileClientBuilds={builds.items}
        buildTabEnabled={buildTabEnabled}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps,
    services: state.services,
    builds: state.builds,
    buildTabEnabled: state.config.buildTabEnabled
  };
}

const mapDispatchToProps = {
  fetchApps,
  fetchServices,
  fetchBuilds
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
