import React, { Component } from 'react';
import { Alert, Row, Col, DropdownKebab, MenuItem} from 'patternfly-react';

import MobileClientServiceChart from './MobileClientServiceChart';
import ComponentSectionLabel from '../common/ComponentSectionLabel';
import MobileClientBuildList from './MobileClientBuildList';
import MobileListViewItem from '../common/MobileListViewItem';
import MobileClientBuildHistoryList from './MobileClientBuildHistoryList'

import './OverviewListItem.css';

// todo 
const mobileServices = {
    "mobileServices": {
        "bound": 1,
        "unbound": 2
    }
};

// TODO: Mocked data for now.
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

const actions = () => (
  <DropdownKebab id="mobile-client-actions" pullRight>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Delete</MenuItem>
  </DropdownKebab>
);

const headings = mobileClient => (
    <div className="pull-left text-left">
        <div className="detail">
            <span className="text-uppercase">{mobileClient.spec.clientType}</span>
        </div>
        <a className="name">
            <span>{mobileClient.spec.name}</span>
        </a>
        <div className="detail">{mobileClient.spec.appIdentifier}</div>
    </div>
);

class MobileClientOverviewList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dismissed: false
        };
    }

    handleDismiss = () => {
        this.setState({dismissed: true});
    }

    alert = () => {
        if (!this.state.dismissed) {
            return <Alert type="info" onDismiss={this.handleDismiss}>2 mobile services are not bound to this client. <a>Bind them to use with this client.</a></Alert>;
        }

        return null;
    }

    render = () => {
        const {mobileClient} = this.props;

        return (
            <MobileListViewItem
                className="overview-list-view-item"
                key={mobileClient.metadata.uid}
                actions={actions()}
                checkboxInput={false}
                heading={headings(mobileClient)}
                stacked={false}
                hideCloseIcon={true}
            >
                <Row>
                    <Col md={12}>
                        {this.alert()}
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <ComponentSectionLabel>Mobile Services</ComponentSectionLabel>
                        <MobileClientServiceChart mobileServices={mobileServices}></MobileClientServiceChart>
                        <a>View All Mobile Services</a>
                    </Col>
                    <Col md={6}>
                        <ComponentSectionLabel>Client Info</ComponentSectionLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <ComponentSectionLabel>Mobile Builds</ComponentSectionLabel>
                        <MobileClientBuildList mobileClientBuilds={mobileClientBuilds}></MobileClientBuildList>
                        <a>View All Mobile Builds</a>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                    <a>Hide build history</a>
                        <MobileClientBuildHistoryList mobileClientBuilds={mobileClientBuilds}/>
                    </Col>
                </Row>
            </MobileListViewItem>
        );
    }
}

export default MobileClientOverviewList;