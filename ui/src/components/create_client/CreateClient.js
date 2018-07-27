import React, { Component } from 'react';
import { Nav, NavItem, TabContent, TabPane, Tabs } from 'patternfly-react';
import PlatformItem from './PlatformItem'
import CreateAndroidClient from './CreateAndroidClient'
import CreateCordovaClient from './CreateCordovaClient'
import CreateIOSClient from './CreateIOSClient'

/**
 *  Component for the mobile client creation.
 */
class CreateClient extends Component {
    render() {
        return (
            <div>
                <Tabs id="basic-tabs-pf" defaultActiveKey={1}>
                    <div>
                    <Nav bsClass="nav nav-tabs nav-tabs-pf nav-justified">
                        <NavItem eventKey={1}>
                            <PlatformItem title="Android App" class="fa fa-android"/>
                        </NavItem>
                        <NavItem eventKey={2}>
                            <PlatformItem title="Cordova App">
                            <span><img src="../../img/cordova.png" alt="Cordova"/></span>
                            </PlatformItem>
                        </NavItem>
                        <NavItem eventKey={3}>
                            <PlatformItem title="iOS App" class="fa fa-apple"/>
                        </NavItem>
                        <NavItem eventKey={4}>
                            <PlatformItem title="Xamarin App">
                            <span><img src="../../img/xamarin.svg" alt="Xamarin"/></span>   
                            </PlatformItem>
                        </NavItem>
                </Nav>
                    <div class="create-client-tabcontent">
                    <TabContent>
                        <TabPane eventKey={1}>
                            <CreateAndroidClient/>
                        </TabPane>
                        <TabPane eventKey={2}>
                            <CreateCordovaClient/>
                        </TabPane>
                        <TabPane eventKey={3}>
                            <CreateIOSClient/>
                        </TabPane>
                        <TabPane eventKey={4}>
                            <CreateXamarinClient/>
                        </TabPane>
                    </TabContent>
                    </div>
                </div>
            </Tabs>
        </div>
      )
    }
}

export default CreateClient;
