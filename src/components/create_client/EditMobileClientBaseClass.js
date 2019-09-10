/* eslint guard-for-in: 0 */
import React, { Component } from 'react';
import { FormGroup, TextInput, TextArea } from '@patternfly/react-core';
import { MobileApp, MAXLENGTH_APPNAME } from '../../models';
import { CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';

export const LABEL_APPNAME = 'Application Name';
export const EXAMPLE_APPNAME = 'myapp';
export const HELP_APPNAME = `Application name can not exceed ${MAXLENGTH_APPNAME} characters. It can not start or end with a special character, and can only contain lowercase letters, numbers, dots and hyphens.`;

/**
 * Base component for the create/edit mobile client form.
 */
class EditMobileClientBaseClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false
    };
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
  // getFormFields() {
  //   return [
  //     {
  //       controlId: CREATE_CLIENT_NAME,
  //       label: this.config.appName.label,
  //       useFieldLevelHelp: false,
  //       showHelp: this.app.getName() && !this.app.isValid(CREATE_CLIENT_NAME), // show the help only if some invalid value is entered
  //       help: this.config.appName.help,
  //       content: this.config.appName.help,
  //       placeholder: this.config.appName.example,
  //       value: this.app.getProperty(CREATE_CLIENT_NAME) || '',
  //       formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} autoFocus />,
  //       validationState: this._validate(CREATE_CLIENT_NAME),
  //       autoComplete: 'off',
  //       onChange: e => this.props.setFieldValue(CREATE_CLIENT_NAME, e.target.value)
  //     }
  //   ];
  // }

  render() {
    this.app = new MobileApp({ ...this.props.ui.app });
    const { isValid } = this.state;
    //const generatedFields = this.getFormFields().map(formField => VerticalFormField({ ...formField }));
    return (
      <React.Fragment>
          {/* <Form vertical="true">{generatedFields}</Form> */}
            <FormGroup
              label={this.config.appName.label}
              isRequired
              fieldId={CREATE_CLIENT_NAME}
              isValid={isValid}
            >
              <TextInput
              isValid={isValid}
              isRequired
              placeholder={this.config.appName.example}
              type="text"
              id={CREATE_CLIENT_NAME}
              name="simple-form-name"
              aria-describedby="simple-form-name-helper"
              value={this.app.getProperty(CREATE_CLIENT_NAME) || ''}
              onChange={e => this.props.setFieldValue(CREATE_CLIENT_NAME, e.target.value)}
              />
            </FormGroup>
      </React.Fragment>
    );
  }
}

export default EditMobileClientBaseClass;
