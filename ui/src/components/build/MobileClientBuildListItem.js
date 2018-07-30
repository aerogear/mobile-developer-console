import React, { Component } from 'react';
import { ListView, DropdownKebab, MenuItem, Button} from 'patternfly-react';
import BuildStatus from '../common/BuildStatus';
import MobileListViewItem from '../common/MobileListViewItem';

const actions = () => (
  <React.Fragment id="mobile-client-actions" pullRight>
  <Button>
    Start Build
  </Button>
  <DropdownKebab>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Delete</MenuItem>
  </DropdownKebab>
</React.Fragment>
);

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
              className="overview-list-view-item"
              key={mobileClientBuild.metadata.uid}
              actions={actions()}
              checkboxInput={false}
              heading={heading(mobileClientBuild)}
              hideCloseIcon={true}
          >
          <p>Some info</p>
          </MobileListViewItem>
      );
  }
}

export default MobileClientBuildListItem;
