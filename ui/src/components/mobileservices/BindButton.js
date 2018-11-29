import React, { Component } from 'react';
import { Button } from 'patternfly-react';

class BindButton extends Component {
  render() {
    if (this.props.service.isBindingOperationInProgress()) {
      return null;
    }
    return (
      <Button className="bind-button" onClick={() => this.props.onClick()}>
        Bind to App
      </Button>
    );
  }
}

export default BindButton;
