import React, { Component } from 'react';
import { Form } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import { validateId, validateAppName, formChanged } from './CreateClientFormUtils';
import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from './Constants';

/**
 * Component for the common shared create mobile client form.
 */
class BaseCreateMobileClient extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = props;
  }

  getFormFields = () => [
    {
      controlId: CREATE_CLIENT_NAME,
      label: '* Application Name',
      useFieldLevelHelp: true,
      value: this.state.clientConfiguration[CREATE_CLIENT_NAME],
      content: 'Enter application name (like <em>myapp</em>)',
      formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} />,
      validationState: _get(this.state.validation, CREATE_CLIENT_NAME),
      onChange: e => formChanged(this, CREATE_CLIENT_NAME, e.target.value, value => validateAppName(value))
    },
    {
      controlId: CREATE_CLIENT_APP_ID,
      label: '* Package Name',
      useFieldLevelHelp: true,
      value: this.state.clientConfiguration[CREATE_CLIENT_APP_ID],
      content: 'Enter package name (like <em>org.aerogear.android.myapp</em>)',
      formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} />,
      validationState: _get(this.state.validation, CREATE_CLIENT_APP_ID),
      onChange: e => formChanged(this, CREATE_CLIENT_APP_ID, e.target.value, value => validateId(value))
    }
  ];

  render() {
    return '';
  }
}

export default BaseCreateMobileClient;
