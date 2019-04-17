import React, { Component } from 'react';
import { connect } from 'react-redux';

import MobileClientCardView from '../components/overview/MobileClientCardView';
import { fetchApps, watchApps } from '../actions/apps';
import { fetchBuilds } from '../actions/builds';
import DataService from '../DataService';

export class Overview extends Component {
  componentDidMount() {
    this.props.fetchApps();

    this.props.watchApps(this.props.fetchApps);

    if (this.props.buildTabEnabled) {
      this.props.fetchBuilds();
      this.wsBuilds = DataService.watchBuilds(this.props.fetchBuilds);
    }
  }

  componentWillUnmount() {
    this.wsBuilds && this.wsBuilds.close();
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
  fetchBuilds,
  watchApps
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
