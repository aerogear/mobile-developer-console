import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';

import { fetchAndWatchApps } from '../actions/apps';
import { fetchAndWatchBuilds } from '../actions/builds';

import { MobileApp } from '../models';
import { ServiceSDKSetup } from '../components/configuration/ServiceSDKSetup';
import frameworks from '../components/configuration/sdk-config-docs/frameworks';

export class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTabKey: 0
    };
    this.handleTabClick = (event, tabIndex) => {
      this.setState({
        activeTabKey: tabIndex
      });
    };
  }

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
    const activeFramework = this.state.activeTabKey === 0 ? 'cordova' : 'ionic';
    const framework = frameworks[activeFramework]();

    return (
      <PageSection variant={PageSectionVariants.light}>
        <Title className="pf-u-mb-lg" headingLevel="h2" size="2xl">SDK Configuration</Title>
        <Tabs activeKey={this.state.activeTabKey} onSelect={this.handleTabClick}>
          <Tab eventKey={0} title="Cordova" />
          <Tab eventKey={1} title="Ionic" />
        </Tabs>
        <PageSection>
          <ol>
            {framework.steps.map((docs, index) => (
              <ServiceSDKSetup docs={docs} key={`docs-${index}`} />
            ))}
          </ol>
       </PageSection>
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
