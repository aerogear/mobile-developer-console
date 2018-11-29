import React, { Component } from 'react';
import { ListView, Icon } from 'patternfly-react';

class BindingStatus extends Component {
  render() {
    return (
      <ListView.InfoItem key="bind-status">
        {this.props.service.isBindingOperationInProgress() && (
          <React.Fragment>
            <Icon name="spinner" spin size="lg" />
            {this.props.service.getBindingOperation()} In Progress
          </React.Fragment>
        )}
        {this.props.service.isBindingOperationFailed() && (
          <React.Fragment>
            <Icon type="pf" name="error-circle-o" />
            Operation Failed. Please Try Again Later.
          </React.Fragment>
        )}
      </ListView.InfoItem>
    );
  }
}

export default BindingStatus;
