import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PageSection } from '@patternfly/react-core';

import { fetchAndWatchApps } from '../actions/apps';
import { fetchAndWatchBuilds } from '../actions/builds';

import { MobileApp } from '../models';
import FrameworkSDKDocs from '../components/configuration/FrameworkSDKDocs';
import { ServiceSDKDocs } from '../components/configuration/ServiceSDKDocs';
import { ServiceSDKSetup } from '../components/configuration/ServiceSDKSetup';


import frameworks from '../components/configuration/sdk-config-docs/frameworks';

export class Overview extends Component {
  componentDidMount() {
    this.props.fetchAndWatchApps();

    if (this.props.buildTabEnabled) {
      this.props.fetchAndWatchBuilds();
    }
  }

  getMobileApp() {
    return MobileApp.find(this.props.apps.items, this.props.match.params.id) || new MobileApp();
  }


  render() {
    const mobileApp = this.getMobileApp();
    const frameworksAll= Object.keys(frameworks).map(key => (
        frameworks[key](this.props.docsPrefix)
    ))
    console.log("FRAMEWORK", frameworksAll)
    return (
      <PageSection>
        <h1>SDK Configuration</h1>
        {frameworksAll.map((docs, index) => (
         <ServiceSDKSetup docs={docs} key={`docs-${index}`} />
       ))}
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
