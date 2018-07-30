import React, { Component } from 'react';
import { DropdownKebab, MenuItem, Button, Row, Col} from 'patternfly-react';
import BuildStatus from '../common/BuildStatus';
import MobileListViewItem from '../common/MobileListViewItem';
<<<<<<< HEAD
import BuildConfig from './BuildConfig';
=======
import BuildConfigDetails from './BuildConfigDetails';
>>>>>>> added build overview screen. using endpoint instead of mock data
import ComponentSectionLabel from '../common/ComponentSectionLabel';


const actions = () => (
<<<<<<< HEAD
  <React.Fragment id="mobile-client-actions" pullRight>
  <Button>
    Start Build
  </Button>
  <DropdownKebab>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Delete</MenuItem>
  </DropdownKebab>
</React.Fragment>
=======
  <React.Fragment>
    <Button>
      Start Build
    </Button>
    <DropdownKebab>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Delete</MenuItem>
    </DropdownKebab>
  </React.Fragment>
>>>>>>> added build overview screen. using endpoint instead of mock data
);

const buildConfig = {
  "jenkinsfilePath": "jenkinsfile",
  "jobName": "ios-debug",
  "branch": "ios-debug",
  "repoUrl": "https://github.com/myusername/my-mobile-application"
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
<<<<<<< HEAD
              className="overview-list-view-item"
=======
              className="build-item"
>>>>>>> added build overview screen. using endpoint instead of mock data
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
<<<<<<< HEAD
              <BuildConfig buildConfig={buildConfig}/>
=======
              <BuildConfigDetails buildConfig={buildConfig}/>
>>>>>>> added build overview screen. using endpoint instead of mock data
            </Col>
          </Row>
          </MobileListViewItem>
      );
  }
}

export default MobileClientBuildListItem;
