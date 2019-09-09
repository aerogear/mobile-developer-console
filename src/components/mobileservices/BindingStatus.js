import React, { Component } from 'react';
import { ListView, Icon } from 'patternfly-react';

class BindingStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasStarted: false
    };
    this.updateState = this.updateState.bind(this);
  }

  updateState() {
    if (this.props.service.isBindingOperationInProgress(this.props.appName) && !this.state.hasStarted) {
      this.setState({
        hasStarted: true
      });
    }
    if (this.state.hasStarted && !this.props.service.isBindingOperationInProgress(this.props.appName)) {
      this.props.onFinished();
      this.setState({
        hasStarted: false
      });
    }
  }

  componentWillUnmount() {
    this.props.onFinished();
  }

  componentDidMount() {
    this.updateState();
  }

  render() {
    return (
      <ListView.InfoItem key="bind-status">
        {this.props.service.isBindingOperationInProgress(this.props.appName) && (
          <React.Fragment>
            <Icon name="spinner" spin size="lg" />
            {this.props.service.getBindingOperation(this.props.appName)}
          </React.Fragment>
        )}
        {this.props.service.isBindingOperationFailed(this.props.appName) && (
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
