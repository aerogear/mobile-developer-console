import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash-es';
import { dismiss, dismissAll } from '../actions/errors';

const MOBILECLIENT = 'mobileclients';
const ALREADYEXISTS = 'AlreadyExists';

function errorMessage(error) {
  try {
    switch (error.response.data.details.kind) {
      case MOBILECLIENT:
        // case to handle MobileClient CRs
        return { displayMessage: mobileClientError(error), message: error.message };
      default:
        return { message: error.message };
    }
  } catch (TypeError) {
    // catch any error if error.response.data.details.kind does not exist
    return { message: error.message };
  }
}

function mobileClientError(error) {
  try {
    switch (error.response.data.reason) {
      case ALREADYEXISTS: {
        // handle if mobileClient exists
        const appName = get(error, 'response.data.details.name');
        return `An app named "${appName}" already exists`;
      }
      default:
        return error.message;
    }
  } catch (TypeError) {
    // catch any errors if error.response.data.reason does not exist
    return error.message;
  }
}

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
          <Alert
            key={index}
            variant="danger"
            title="Request Failed"
            action={<AlertActionCloseButton onClose={() => dismissError(error)} />}
          >
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

export { errorMessage, mobileClientError, MOBILECLIENT, ALREADYEXISTS };
