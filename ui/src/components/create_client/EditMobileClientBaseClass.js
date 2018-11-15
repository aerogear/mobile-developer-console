/* eslint guard-for-in: 0 */
import React, { Component } from 'react';
import { Grid, Form } from 'patternfly-react';
import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';
import { MobileApp } from '../../models';

export const LABEL_APPNAME = '* App Name';
export const EXAMPLE_APPNAME = 'myapp';
export const HELP_APPNAME = 'App name must only contain lowercase letters, numbers and dots.';

export const LABEL_APPIDENTIFIER = '* Package Name';
export const EXAMPLE_APPIDENTIFIER = 'org.aerogear.myapp';
export const HELP_APPIDENTIFIER =
  'Package name must have at least two segments, start with a letter and contain only letters, dots, numbers and _.';

/**
 * Base component for the create/edit mobile client form.
 */
class EditMobileClientBaseClass extends Component {
  constructor(props) {
    super(props);
    this.config = {
      appName: {
        label: LABEL_APPNAME,
        example: EXAMPLE_APPNAME,
        help: HELP_APPNAME
      },
      appIdentifier: {
        label: LABEL_APPIDENTIFIER,
        example: EXAMPLE_APPIDENTIFIER,
        help: HELP_APPIDENTIFIER
      }
    };
    this.app = new MobileApp({ ...this.props.ui.app });
  }

  _validate(propertyName) {
    if (this.app.getProperty(propertyName) === undefined) {
      return undefined;
    }
    return this.app.isValid(propertyName) ? 'success' : 'error';
  }

  /**
   * Subclasses should override this if they needs to provide custom fields.
   */
  getFormFields() {
    return [
      {
        controlId: CREATE_CLIENT_NAME,
        label: this.config.appName.label,
        useFieldLevelHelp: false,
        showHelp: this.app.getName() && !this.app.isValid(CREATE_CLIENT_NAME), // show the help only if some invalid value is entered
        help: this.config.appName.help,
        content: this.config.appName.help,
        placeholder: this.config.appName.example,
        value: this.app.getProperty(CREATE_CLIENT_NAME),
        formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} autoFocus />,
        validationState: this._validate(CREATE_CLIENT_NAME),
        onChange: e => this.props.setFieldValue(CREATE_CLIENT_NAME, e.target.value)
      },
      {
        controlId: CREATE_CLIENT_APP_ID,
        label: this.config.appIdentifier.label,
        useFieldLevelHelp: false,
        showHelp: this.app.getProperty(CREATE_CLIENT_APP_ID) && !this.app.isValid(CREATE_CLIENT_APP_ID), // show the help only if some invalid value is entered
        help: this.config.appIdentifier.help,
        placeholder: this.config.appIdentifier.example,
        content: this.config.appIdentifier.help,
        value: this.app.getProperty(CREATE_CLIENT_APP_ID),
        readOnly: this.props.editing,
        formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} />,
        validationState: this._validate(CREATE_CLIENT_APP_ID),
        onChange: e => this.props.setFieldValue(CREATE_CLIENT_APP_ID, e.target.value)
      }
    ];
  }

  render() {
    const generatedFields = this.getFormFields().map(formField => VerticalFormField({ ...formField }));
    return (
      <div>
        <Grid bsClass="create-client-form">
          <Form vertical="true">{generatedFields}</Form>
        </Grid>
      </div>
    );
  }
}

export default EditMobileClientBaseClass;
