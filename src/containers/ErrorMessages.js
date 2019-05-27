import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ToastNotificationList, ToastNotification } from 'patternfly-react';
import { withRouter } from 'react-router-dom';
import { dismiss, dismissAll } from '../actions/errors';

export class ErrorMessages extends Component {
  componentWillMount() {
    const { history, dismissAllErrors } = this.props;
    this.unlisten = history.listen(dismissAllErrors);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { errors, dismissError } = this.props;
    return (
      <ToastNotificationList>
        {[...new Set(errors.map(error => error.message))].map((error, index) => (
          <ToastNotification key={index} onDismiss={() => dismissError(error)}>
            <span>{error}</span>
          </ToastNotification>
        ))}
      </ToastNotificationList>
    );
  }
}

const mapStateToProps = state => ({
  errors: [...state.errors.errors]
});

const mapDispatchToProps = {
  dismissError: dismiss,
  dismissAllErrors: dismissAll
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ErrorMessages)
);
