import React, { Component } from 'react';
import { Nav, NavItem, TabContent, TabPane, Tabs } from 'patternfly-react';
import ConfigurationView from './ConfigurationView';
import MobileClientBuildOverviewList from './build/MobileClientBuildOverviewList';

const mobileClientBuilds = [
    {
        "metadata": {
            "name": "android-debug-2",
            "selfLink": "/apis/build.openshift.io/v1/namespaces/myproject/builds/android-debug-2",
            "annotations": {
                "openshift.io/build.number": "2"
            },
            "uid": "5ea6f7ee-90c6-11e8-bd24-f6a35857c6e5"
        },
        "status": {
            "phase": "Failed",
            "startTimestamp": "2018-07-23T15:18:04Z",
            "completionTimestamp": "2018-07-24T15:19:35Z",
            "config": {
                "kind": "BuildConfig",
                "namespace": "myproject",
                "name": "android-debug"
            },
            "output": {}
        },
        "kind": "Build",
        "apiVersion": "build.openshift.io/v1"
    },
    {
        "metadata": {
            "name": "ios-debug-1",
            "selfLink": "/apis/build.openshift.io/v1/namespaces/myproject/builds/ios-debug-1",
            "annotations": {
                "openshift.io/build.number": "1"
            },
            "uid": "5ea6f7ee-98c6-11e8-bd24-f6a35857c6e5"
        },
        "status": {
            "phase": "Complete",
            "startTimestamp": "2018-07-25T15:18:04Z",
            "completionTimestamp": "2018-07-24T15:19:35Z",
            "config": {
                "kind": "BuildConfig",
                "namespace": "myproject",
                "name": "ios-debug"
            },
            "output": {}
        },
        "kind": "Build",
        "apiVersion": "build.openshift.io/v1"
    },
    {
        "metadata": {
            "name": "cordova-release-2",
            "selfLink": "/apis/build.openshift.io/v1/namespaces/myproject/builds/ios-debug-1",
            "annotations": {
                "openshift.io/build.number": "3"
            },
            "uid": "5ea6f7ee-90c6-11e8-bd24-f6a35857c6e4"
        },
        "status": {
            "phase": "Running",
            "startTimestamp": "2018-07-25T15:18:04Z",
            "completionTimestamp": "2018-07-24T15:19:35Z",
            "config": {
                "kind": "BuildConfig",
                "namespace": "myproject",
                "name": "cordova-release"
            },
            "output": {}
        },
        "kind": "Build",
        "apiVersion": "build.openshift.io/v1"
    }
];

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
                            <ConfigurationView />
                        </TabPane>
                        <TabPane eventKey={2}>
                            <MobileClientBuildOverviewList mobileClientBuilds={mobileClientBuilds}></MobileClientBuildOverviewList>
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
