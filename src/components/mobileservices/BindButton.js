import React, { Component } from 'react';
import { Button } from '@patternfly/react-core';

class BindButton extends Component {
  render() {
    if (this.props.service.isBindingOperationInProgress(this.props.appName)) {
      return null;
    }
    return (
      <Button variant="secondary" className="bind-button" onClick={() => this.props.onClick()}>
        Create a binding
      </Button>
    );
  }
}

export default BindButton;
