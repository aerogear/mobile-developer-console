import React, { Component } from 'react';
import { Grid, Form } from 'patternfly-react';
import { validateId, validateAppName, formChanged } from './CreateClientFormUtils';
import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateMobileClientBaseClass extends Component {
  content() {
    return {};
  }

  config = {
    appName: {
      label: '* App Name',
      help: 'Enter application name (like <em>myapp</em>)',
      example_content: ''
    },
    appIdentifier: {
      label: '* Package Name',
      help: 'Enter package name (like <em>org.aerogear.myapp</em>)',
      example_content: ''
    }
  }
  
  validate(controlId, value) {

  }

  _validate(controlId, value) {
    var result = this.validate(controlId, value);
    if (result === 'success') {

    } else {

    }
  }

  getFormFields = () => [
    {
      controlId: CREATE_CLIENT_NAME,
      label: this.config.appName.label,
      useFieldLevelHelp: true,
      value: this.config.appName.example_content,
      content: this.config.appName.help,
      tabIndex: -1,
      formControl: ({ validationState, ...props }) => (
        <Form.FormControl type="text" {...props} tabIndex="1" autofocus="true" />
      ),
      validationState: null,
      onChange: e => formChanged(this, CREATE_CLIENT_NAME, e.target.value, value => validateAppName(value)),
    },
    {
      controlId: CREATE_CLIENT_APP_ID,
      label: this.config.appIdentifier.label,
      useFieldLevelHelp: true,
      value: this.config.appIdentifier.example_content,
      content: this.config.appIdentifier.help,
      tabIndex: -1,
      formControl: ({ validationState, ...props }) => (
        <Form.FormControl type="text" {...props} tabIndex="2" />
      ),
      validationState: null,
      onChange: e => formChanged(this, CREATE_CLIENT_APP_ID, e.target.value, value => validateId(value)),
    },
  ]

  renderFormFields(formFields) {
    const generatedFields = formFields.map(formField => VerticalFormField({ ...formField }));
    return (<div>
      <Grid bsClass="create-client-form">
        <Form vertical>
          {generatedFields}
        </Form>
      </Grid>
    </div>
    )
  }

  render() {
    return this.renderFormFields(this.getFormFields());
  }
}

export default CreateMobileClientBaseClass;
