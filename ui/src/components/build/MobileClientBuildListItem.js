import React, { Component } from 'react';
import { DropdownKebab, MenuItem, Button, Row, Col} from 'patternfly-react';
import BuildStatus from '../common/BuildStatus';
import MobileListViewItem from '../common/MobileListViewItem';
import BuildConfigDetails from './BuildConfigDetails';
import ComponentSectionLabel from '../common/ComponentSectionLabel';
import BuildDownloadLinks from './BuildDownloadLinks';
import MobileClientBuildHistoryList from './MobileClientBuildHistoryList';

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
        "apiVersion": "build.openshift.io/v1",
        "downloadURL": "https://mcp-standalone-main.192.168.37.1.nip.io/build/my-job-1/download?token=26c2afda-d370-431e-85e2-b99a19cd4c20"
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
        "apiVersion": "build.openshift.io/v1",
        "downloadURL": "https://mcp-standalone-main.192.168.37.1.nip.io/build/my-job-1/download?token=26c2afda-d370-431e-85e2-b99a19cd4c20"
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
        "apiVersion": "build.openshift.io/v1",
        "downloadURL": "https://mcp-standalone-main.192.168.37.1.nip.io/build/my-job-1/download?token=26c2afda-d370-431e-85e2-b99a19cd4c20"
    }
];

const actions = () => (
  <React.Fragment>
    <Button>
      Start Build
    </Button>
    <DropdownKebab>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Delete</MenuItem>
    </DropdownKebab>
  </React.Fragment>
);

const buildConfig = {
  "jenkinsfilePath": "jenkinsfile",
  "jobName": "ios-debug",
  "branch": "ios-debug",
  "repoUrl": "https://github.com/myusername/my-mobile-application"
}

const downloadInfo = {
  "downloadUrl": "https://github.com/somedownloadlink"
}

const heading = mobileClientBuild => (
    <div className="pull-left text-left">
        <a className="name">
            <span><BuildStatus build={mobileClientBuild}></BuildStatus></span>
            <span>{mobileClientBuild.metadata.name}</span>
        </a>
    </div>
);

class MobileClientBuildListItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClientBuildConfigs: [],
      isHidden: true
    };
  }

  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  historyButton () {
    if (this.state.isHidden) {
      return (
        <Button bsStyle="link" onClick={this.toggleHidden.bind(this)} >
        <span className="fa fa-angle-right fa-fw" aria-hidden="true"></span> Show Build History </Button>
      )
    } else {
      return (
        <Button bsStyle="link" onClick={this.toggleHidden.bind(this)} >
        <span className="fa fa-angle-down fa-fw" aria-hidden="true"></span> Hide Build History </Button>
      )
    }
  }

  render = () => {
      const {mobileClientBuild} = this.props;

      return (
          <MobileListViewItem
              className="build-item"
              key={mobileClientBuild.metadata.uid}
              actions={actions()}
              checkboxInput={false}
              heading={heading(mobileClientBuild)}
              hideCloseIcon={true}
          >
          <Row>
            <Col md={12}>
              <ComponentSectionLabel>
                Build Config
              </ComponentSectionLabel>
              <BuildConfigDetails buildConfig={buildConfig}/>
            </Col>
            <Col md={12}>
              <ComponentSectionLabel>
                Builds
              </ComponentSectionLabel>
              <Row>
                  <Col md={12}>
                      <div className="mobile-chevron">
                          <a
                              href=""
                              onClick={e => {
                                  e.preventDefault();
                                  this.setState({ buildHistoryOpen: !this.state.buildHistoryOpen })
                              }}
                          >
                              <span className={ this.state.buildHistoryOpen ? "fa fa-angle-down" : "fa fa-angle-right" } />&nbsp;
                              { this.state.buildHistoryOpen ? 'Hide' : 'Show' } build history
                          </a>
                      </div>
                      { this.state.buildHistoryOpen ?
                          <MobileClientBuildHistoryList className="collapse in" id="demo" mobileClientBuilds={mobileClientBuilds}/>
                          :
                          <React.Fragment />
                      }
                  </Col>
              </Row>
              <BuildDownloadLinks downloadInfo={downloadInfo}/>
            </Col>
          </Row>
          </MobileListViewItem>
      );
  }
}

export default MobileClientBuildListItem;
