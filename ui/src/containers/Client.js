import React, { Component } from 'react';
import { Nav, NavItem, TabContent, TabPane, Tabs } from 'patternfly-react';
import { connect } from 'react-redux';
import ConfigurationView from '../components/configuration/ConfigurationView';
import MobileClientBuildsList from '../components/build/MobileClientBuildsList';
import MobileServiceView from '../components/mobileservices/MobileServiceView';
import { fetchBuildConfigs } from '../actions/buildConfigs';
import { fetchBuilds } from '../actions/builds';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buildConfigs: []
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchBuildConfigs());
    this.props.dispatch(fetchBuilds());
  }

  componentDidUpdate(prevProps) {
    if (this.props.buildConfigs !== prevProps.buildConfigs || this.props.builds !== prevProps.builds) {
      const configs = this.props.buildConfigs.items.filter(
        config => config.metadata.labels['mobile-client-id'] === this.props.match.params.id
      );

      this.props.builds.items.forEach(build => {
        const matchingConfig = configs.find(config => config.metadata.name === build.metadata.labels.buildconfig);
        if (matchingConfig) {
          matchingConfig.builds = matchingConfig.builds || [];
          matchingConfig.builds.push(build);
        }
      });

      this.setState({ buildConfigs: configs });
    }
  }

  render() {
    return (
      <div>
        <div>
          <Tabs id="basic-tabs-pf" defaultActiveKey={1}>
            <div>
              <Nav bsClass="nav nav-tabs nav-tabs-pf nav-justified">
                <NavItem eventKey={1}>Configuration</NavItem>
                <NavItem eventKey={2}>Builds</NavItem>
                <NavItem eventKey={3}>Mobile Services</NavItem>
              </Nav>
              <TabContent>
                <TabPane eventKey={1}>
                  <ConfigurationView />
                </TabPane>
                <TabPane eventKey={2}>
                  <MobileClientBuildsList buildConfigs={this.state.buildConfigs} />
                </TabPane>
                <TabPane eventKey={3}>
                  <MobileServiceView />
                </TabPane>
              </TabContent>
            </div>
          </Tabs>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    buildConfigs: state.buildConfigs,
    builds: state.builds
  };
}

export default connect(mapStateToProps)(Client);
