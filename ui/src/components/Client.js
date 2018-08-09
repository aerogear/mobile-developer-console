import React, { Component } from 'react';
import { Nav, NavItem, TabContent, TabPane, Tabs } from 'patternfly-react';
import ConfigurationView from './configuration/ConfigurationView';
import MobileClientBuildsList from './build/MobileClientBuildsList';
import DataService from '../DataService';

class Client extends Component {

  constructor(props) {
    super(props);

    this.state = {
      buildConfigs: []
    };
  }

  componentDidMount = async () => {
    try {
      let configs = await DataService.buildConfigs();
      configs = configs.filter(config => config.metadata.labels['mobile-client-id'] === this.props.match.params.id);
      
      let builds = await DataService.builds();
      builds.forEach(build => {
        const matchingConfig = configs.find(config => config.metadata.name === build.metadata.labels.buildconfig);
        if (matchingConfig) {
          matchingConfig.builds = matchingConfig.builds || [];
          matchingConfig.builds.push(build);
        }
      });

      this.setState({ buildConfigs: configs });
    } catch (err) {
      console.error('Fetch error: ', err)
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
                            Mobile Services
                        </TabPane>
                    </TabContent>
                </div>
            </Tabs>
        </div>
      </div>
    );
  }
}

export default Client;
