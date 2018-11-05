import React, { Component } from 'react';
import { Grid, Form } from 'patternfly-react';
import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';

/**
 * Component for the Android specific create mobile client form.
 */
class EditMobileClientBaseClass extends Component {
  constructor(platformName, props) {
    super(props);
    this.config = {
      platform: platformName,
      appName: {
        label: '* App Name',
        example: 'myapp',
        help: 'App name must only contain lowercase letters, numbers and dots.'
      },
      appIdentifier: {
        label: '* Package Name',
        example: 'org.aerogear.myapp',
        help:
          'Package name must have at least two segments, start with a letter and contain only letters, dots, numbers and _.'
      }
    };
    // initializing validation state
    const fields = this.getFormFields();

    for (const field in fields) {
      const fieldName = fields[field].controlId;
      if (this.props.app) {
        this.props.setFieldValue(fieldName, this.props.app.spec[fieldName], true);
      } else if (!this.props.ui.fields[fieldName]) {
        this.props.setFieldValue(fieldName, '', undefined);
      }
    }
  }

  /**
   * Subclasses should override this to provide custom validation or validation for custom fields.
   *
   * @param {*} controlId id of the control being validated
   * @param {*} value value to be validate
   */
  validate(controlId, value) {
    switch (controlId) {
      case CREATE_CLIENT_NAME:
        return value !== undefined && value.match('^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$')
          ? 'success'
          : 'error';
      case CREATE_CLIENT_APP_ID:
        return value !== undefined && value.match('^[a-zA-Z][\\w]*(\\.[a-zA-Z][\\w]*)+$') ? 'success' : 'error';
      default:
        return 'success';
    }
  }

  _validate(controlId, value) {
    this.props.setFieldValue(controlId, value, this.validate(controlId, value) === 'success');
  }

  validateForm() {
    let dataIsValid = true;
    for (const field in this.props.ui.fields) {
      if (!this.props.ui.fields[field].valid) {
        dataIsValid = false;
      }
    }

    this.props.setStatus(dataIsValid);
  }

  getReadOnlyValueForField(fieldId) {
    if (this.props.app) {
      // we are editing an existing app
      return this.props.app.spec[fieldId];
    }

    return undefined;
  }

  getDefaultValueForField(fieldId) {
    if (this.props.app) {
      // we are editing an existing app
      return this.props.app.spec[fieldId];
    }
    return this.props.ui.fields[fieldId] && this.props.ui.fields[fieldId].value;
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
        showHelp: this.props.ui.fields[CREATE_CLIENT_NAME] && this.props.ui.fields[CREATE_CLIENT_NAME].valid === false, // show the help only if some help text is configured
        help: this.config.appName.help,
        content: this.config.appName.help,
        placeholder: this.config.appName.example,
        defaultValue: this.getDefaultValueForField(CREATE_CLIENT_NAME),
        formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} autoFocus />,
        validationState:
          !this.props.ui.fields[CREATE_CLIENT_NAME] || this.props.ui.fields[CREATE_CLIENT_NAME].valid === false
            ? 'error'
            : 'success',
        onChange: e => this._validate(CREATE_CLIENT_NAME, e.target.value)
      },
      {
        controlId: CREATE_CLIENT_APP_ID,
        label: this.config.appIdentifier.label,
        useFieldLevelHelp: false,
        showHelp:
          this.props.ui.fields[CREATE_CLIENT_APP_ID] && this.props.ui.fields[CREATE_CLIENT_APP_ID].valid === false, // show the help only if some help text is configured
        help: this.config.appIdentifier.help,
        placeholder: this.config.appIdentifier.example,
        content: this.config.appIdentifier.help,
        defaultValue: this.props.app ? undefined : this.getDefaultValueForField(CREATE_CLIENT_APP_ID),
        value: this.getReadOnlyValueForField(CREATE_CLIENT_APP_ID),
        readOnly: this.props.app,
        formControl: ({ validationState, ...props }) => <Form.FormControl type="text" {...props} />,
        validationState:
          !this.props.ui.fields[CREATE_CLIENT_APP_ID] || this.props.ui.fields[CREATE_CLIENT_APP_ID].valid === false
            ? 'error'
            : 'success',
        onChange: e => this._validate(CREATE_CLIENT_APP_ID, e.target.value)
      }
    ];
  }

  componentDidUpdate() {
    this.validateForm();
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
