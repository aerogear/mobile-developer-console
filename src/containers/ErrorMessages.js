import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
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
      <div className="mdc-alert-group">
        {[...new Set(errors.map(error => error.message))].map((error, index) => (
          <Alert key={index} variant="danger" title="Request Failed" action={<AlertActionCloseButton onClose={() => dismissError(error)} />}>
            {error}
          </Alert>
        ))}
      </div>
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