import React, { Component } from 'react';
import { Nav, NavItem, TabContent, TabPane, Tabs } from 'patternfly-react';

class Client extends Component {
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
                            Configuration
                        </TabPane>
                        <TabPane eventKey={2}>
                            Builds
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
