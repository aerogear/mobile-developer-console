import React, { Component } from 'react';
import { Nav, NavItem, TabContent, TabPane, Tabs } from 'patternfly-react';
import ConfigurationView from './configuration/ConfigurationView';
import MobileClientBuildsList from './build/MobileClientBuildsList';
import MobileServiceView from './mobileservices/MobileServiceView';

const listBuildsUrl = `/api/builds`;

class Client extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClientBuilds: []
    };
  }

  componentDidMount = () => {
    fetch(listBuildsUrl, {credentials: "same-origin"})
      .then(response => response.json())
      .then(result => {
        this.setState({mobileClientBuilds: result.items});
      })
      .catch(err => {
        console.error('Fetch error: ', err)
      });
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
                            <MobileClientBuildsList mobileClientBuilds={this.state.mobileClientBuilds}></MobileClientBuildsList>
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

export default Client;
