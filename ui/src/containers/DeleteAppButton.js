import React from 'react';
import { MenuItem } from 'patternfly-react';
import { connect } from 'react-redux';
import { deleteApp } from '../actions/apps';

const DeleteAppButton = (props) => {
  function triggerDeletion() {
    props.deleteApp(props.name);
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
};

export default connect(null, mapDispatchToProps)(DeleteAppButton);
