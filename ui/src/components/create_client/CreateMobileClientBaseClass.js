import React, { Component } from 'react';
import { Grid, Form } from 'patternfly-react';
import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateMobileClientBaseClass extends Component {
  constructor(platformName, props) {
    super(props);
    this.state = {
      valid: false,
      validationState: {}
    }
    this.config = {
      platform: platformName,
      appName: {
        label: '* App Name',
        example: 'myapp',
        help: 'App name must match ^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$'
      },
      appIdentifier: {
        label: '* Package Name',
        example: 'org.aerogear.myapp',
        help: 'Package name must match ^[a-zA-Z][\\w]*(\\.[a-zA-Z][\\w]*)+$',
      }
    }

    // initializing validation state
    var fields = this.getFormFields();

    if (!this.state.initialized) {
      for (var field in fields) {
        this.state.validationState[fields[field].controlId] = null;
      }
      this.state.initialized = true;
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
      case CREATE_CLIENT_NAME: return value !== undefined && value.match('^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$') ? 'success' : 'error';
      case CREATE_CLIENT_APP_ID: return value !== undefined && value.match('^[a-zA-Z][\\w]*(\\.[a-zA-Z][\\w]*)+$') ? 'success' : 'error';
      default: return 'success';
    }
  }

  _validate(controlId, value) {
    var newState = { ...this.state, validationState: { ...this.state.validationState, [controlId]: this.validate(controlId, value) } }
    var dataIsValid = true;

    for (var control in newState.validationState) {
      if (newState.validationState[control] !== 'success') {
        dataIsValid = false;
        break;
      }
    }
    newState.valid = dataIsValid;
    newState.newApp = {
      ...newState.newApp,
      clientType: this.config.platform,
      [controlId]: value
    }
    this.setState(newState);
    this.props.configureClient(newState);
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
        showHelp: this.state.validationState[CREATE_CLIENT_NAME] === 'error', // show the help only if some help text is configured
        help: this.config.appName.help,
        content: this.config.appName.help,
        placeholder: this.config.appName.example,
        formControl: ({ validationState, ...props }) => (
          <Form.FormControl type="text" {...props} tabIndex="1" autoFocus={true} />
        ),
        validationState: this.state.validationState[CREATE_CLIENT_NAME],
        onChange: e => this._validate(CREATE_CLIENT_NAME, e.target.value),
      },
      {
        controlId: CREATE_CLIENT_APP_ID,
        label: this.config.appIdentifier.label,
        useFieldLevelHelp: false,
        showHelp: this.state.validationState[CREATE_CLIENT_APP_ID] === 'error', // show the help only if some help text is configured
        help: this.config.appIdentifier.help,
        placeholder: this.config.appIdentifier.example,
        content: this.config.appIdentifier.help,
        formControl: ({ validationState, ...props }) => (
          <Form.FormControl type="text" {...props} tabIndex="2" />
        ),
        validationState: this.state.validationState[CREATE_CLIENT_APP_ID],
        onChange: e => this._validate(CREATE_CLIENT_APP_ID, e.target.value),
      },
    ];
  }

  render() {
    const generatedFields = this.getFormFields().map(formField => VerticalFormField({ ...formField }));
    return (<div>
      <Grid bsClass="create-client-form">
        <Form vertical="true">
          {generatedFields}
        </Form>
      </Grid>
    </div>
    )
  }
}

export default CreateMobileClientBaseClass;
