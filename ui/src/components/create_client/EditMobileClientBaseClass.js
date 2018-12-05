/* eslint guard-for-in: 0 */
import React, { Component } from 'react';
import { Grid, Form } from 'patternfly-react';
import { CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';
import { MobileApp } from '../../models';

export const LABEL_APPNAME = '* App Name';
export const EXAMPLE_APPNAME = 'myapp';
export const HELP_APPNAME = 'App name must only contain lowercase letters, numbers and dots.';

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
        value: this.app.getProperty(CREATE_CLIENT_NAME) || '',
        formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} autoFocus />,
        validationState: this._validate(CREATE_CLIENT_NAME),
        autoComplete: 'off',
        onChange: e => this.props.setFieldValue(CREATE_CLIENT_NAME, e.target.value),
        onKeyPress: event => {
          if (event.key === 'Enter') {
            event.preventDefault();
          }
        }
      }
    ];
  }

  render() {
    this.app = new MobileApp({ ...this.props.ui.app });
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
