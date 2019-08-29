import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, AlertActionCloseButton } from '@patternfly/react-core';
import { withRouter } from 'react-router-dom';
import { dismiss, dismissAll } from '../actions/errors'
import './style/index.css';

export class ErrorMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {alertOneVisible: true};
    this.hideAlertOne = () => this.setState({ alertOneVisible: false });

  }
  componentWillMount() {
    const { history, dismissAllErrors } = this.props;
    this.unlisten = history.listen(dismissAllErrors);
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { errors, dismissError } = this.props;
    const { alertOneVisible } = this.state;
    return (
      <div className="mdc-alert-group">
        {[...new Set(errors.map(error => error.message))].map((error, index) => (
          <React.Fragment>
            {alertOneVisible && (
              <Alert key={index} variant="danger" title="Danger alert title" action={<AlertActionCloseButton onClose={this.hideAlertOne} />}>
                {error}
              </Alert>
            )}
          </React.Fragment>
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
