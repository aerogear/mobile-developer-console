import React, { Component } from 'react';
import MobileClientOverviewList from './MobileClientOverviewList';
import MobileClientServiceChart from './MobileClientServiceChart';
import { MobileClientBuildList } from './MobileClientBuildList';

const listClientsUrl = `/apis/mobile.k8s.io/v1alpha1/namespaces/test1/mobileclients`;

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


class Overview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClients: []
    };
  }

  componentDidMount = () => {
    fetch(listClientsUrl)
      .then(response => response.json())
      .then(result => {
        this.setState({mobileClients: result.items});
      })
      .catch(err => {
        console.error('Fetch error: ', err)
      });
  }

  render() {
    return (
      <div>
        <MobileClientOverviewList mobileClients={this.state.mobileClients}></MobileClientOverviewList>
        <MobileClientServiceChart mobileServices={mobileServices}></MobileClientServiceChart>
        <MobileClientBuildList mobileClientBuilds={mobileClientBuilds}></MobileClientBuildList>
      </div>
    );
  }
}

export default Overview;
