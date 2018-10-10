import React from 'react';
import { MenuItem } from 'patternfly-react';
import { connect } from 'react-redux';
import { deleteApp } from '../actions/apps';
import { deleteBuildConfig } from '../actions/buildConfigs';

const DeleteItemButton = (props) => {
  const { itemName, itemType } = props;
  function triggerDeletion() {
    switch (itemType) {
      case 'app':
        props.deleteApp(itemName);
        break;
      case 'buildconfig':
        props.deleteBuildConfig(itemName);
        break;
      default:
        break;
    }
    // This ensure hiding the dropdown menu when deletion was not successful
    // See https://github.com/react-bootstrap/react-bootstrap/issues/541
    document.dispatchEvent(new MouseEvent('click'));
  }
  return (
    <MenuItem onClick={triggerDeletion}>Delete</MenuItem>
  );
};

const mapDispatchToProps = {
  deleteApp,
  deleteBuildConfig,
};

export default connect(null, mapDispatchToProps)(DeleteItemButton);
