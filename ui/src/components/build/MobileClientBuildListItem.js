import React, { Component } from 'react';
import { DropdownKebab, MenuItem, Button, Row, Col} from 'patternfly-react';
import BuildStatus from '../common/BuildStatus';
import MobileListViewItem from '../common/MobileListViewItem';
import BuildConfigDetails from './BuildConfigDetails';
import ComponentSectionLabel from '../common/ComponentSectionLabel';
import BuildDownloadLinks from './BuildDownloadLinks';

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
              <BuildDownloadLinks downloadInfo={downloadInfo}/>
            </Col>
          </Row>
          </MobileListViewItem>
      );
  }
}

export default MobileClientBuildListItem;
