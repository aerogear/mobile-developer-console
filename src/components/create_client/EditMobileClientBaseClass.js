/* eslint guard-for-in: 0 */
import React, { Component } from 'react';
import { Grid, Form, Row, Col } from 'patternfly-react';
import { MobileApp } from '../../models';
import { CREATE_CLIENT_NAME } from './Constants';
import { VerticalFormField } from './VerticalFormField';

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
        onChange: e => this.props.setFieldValue(CREATE_CLIENT_NAME, e.target.value)
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
        <p>JavaScript-based mobile apps can be configured for a variety of mobile platforms.</p>
        <p>Our JavaScript SDK supports the following frameworks:</p>
        <Row className="show-grid container">
          <Col md={1} className="text-center">
            <img src="/img/cordova.jpg" width="25" height="25" alt="React logo" />
            <p>Cordova</p>
          </Col>
          <Col md={1} className="text-center">
            <img src="/img/react.jpg" width="25" height="25" alt="React logo" />
            <p>React</p>
          </Col>
          <Col md={1} className="text-center">
            <img src="/img/ionic.jpg" width="25" height="25" alt="Ionic logo" />
            <p>Ionic</p>
          </Col>
          <Col md={1} className="text-center">
            <img src="/img/angular.jpg" width="25" height="25" alt="Angular logo" />
            <p>Angular</p>
          </Col>
          <Col md={1} className="text-center">
            <img src="/img/vue.jpg" width="25" height="25" alt="Vue logo" />
            <p>Vue</p>
          </Col>
        </Row>
      </div>
    );
  }
}

export default EditMobileClientBaseClass;
