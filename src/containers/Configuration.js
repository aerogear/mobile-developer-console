import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageSection } from '@patternfly/react-core';

import { fetchAndWatchApps } from '../actions/apps';
import { fetchAndWatchBuilds } from '../actions/builds';

export class Overview extends Component {
  componentDidMount() {
    this.props.fetchAndWatchApps();

    if (this.props.buildTabEnabled) {
      this.props.fetchAndWatchBuilds();
    }
  }

  render() {
    return (
      <PageSection>
        TODO
      </PageSection>
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
  fetchAndWatchApps,
  fetchAndWatchBuilds
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
