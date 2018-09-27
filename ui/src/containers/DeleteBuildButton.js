import React from 'react';
import { MenuItem } from 'patternfly-react';
import { connect } from 'react-redux';
import { deleteBuildConfig } from '../actions/buildConfigs';

const DeleteBuildButton = (props) => {
  function triggerDeletion() {
    props.deleteBuildConfig(props.jobName);
    // This ensure hiding the dropdown menu when deletion was not successful
    // See https://github.com/react-bootstrap/react-bootstrap/issues/541
    document.dispatchEvent(new MouseEvent('click'));
  }
  return (
    <MenuItem onClick={triggerDeletion}>Delete</MenuItem>
  );
};

const mapDispatchToProps = {
  deleteBuildConfig,
};

export default connect(null, mapDispatchToProps)(DeleteBuildButton);
