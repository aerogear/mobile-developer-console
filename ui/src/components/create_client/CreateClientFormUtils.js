/* eslint react/prop-types: 0 */

import React from 'react';
import { Grid, Form, FieldLevelHelp } from 'patternfly-react';

/**
 * Utilities for the create mobile client UI functionality.
 */

/**
 * Function for creating horizontally aligned form fields.
 */
export const HorizontalFormField = ({
  controlId,
  label,
  help,
  formControl,
  validationState,
  bsSize,
  showHelp,
  useFieldLevelHelp,
  content,
  close,
  ...props
}) => {
  const controlProps = { ...props };

  if (bsSize) controlProps.bsSize = bsSize;
  if (validationState) controlProps.validationState = validationState;

  const formGroupProps = { key: controlId, controlId, ...controlProps };

  if (useFieldLevelHelp) {
    const htmlContent = (
      <div
        dangerouslySetInnerHTML={{
          __html: content
        }}
      />
    );
    return (
      <Form.FormGroup {...formGroupProps}>
        <Grid.Col componentClass={Form.ControlLabel} sm={3}>
          {label}
          <FieldLevelHelp content={htmlContent} close={close} />
        </Grid.Col>
        <Grid.Col sm={5}>
          {formControl(controlProps)}
          {showHelp && help && <Form.HelpBlock>{help}</Form.HelpBlock>}
        </Grid.Col>
      </Form.FormGroup>
    );
  }
  return (
    <Form.FormGroup {...formGroupProps}>
      <Grid.Col componentClass={Form.ControlLabel} sm={3}>
        {label}
      </Grid.Col>
      <Grid.Col sm={5}>
        {formControl(controlProps)}
        {showHelp && help && <Form.HelpBlock>{help}</Form.HelpBlock>}
      </Grid.Col>
    </Form.FormGroup>
  );
};

/**
 * Renders form with some fields and button strip.
 * @param {string} title Form's title
 * @param {Array} formFields fields to be rendered
 */
export function renderForm(title, formFields) {
  const generatedFields = formFields.map(formField => HorizontalFormField({ ...formField }));
  return (
    <div>
      <h2>{title}</h2>
      <Grid bsClass="create-client-form">
        <Form horizontal>{generatedFields}</Form>
      </Grid>
    </div>
  );
}

/**
 * Validates mobile client application name.
 * @param {string} appName
 */
export function validateAppName(appName) {
  // TODO improve app name validation
  return appName !== undefined && appName.length > 0 ? 'success' : 'error';
}

/**
 * Validates mobile client application identifier / package name.
 * @param {string} appName
 */
export function validateId(appId) {
  // TODO improve app id validation
  return appId !== undefined && appId.length > 0 ? 'success' : 'error';
}

/**
 * Updates clientConfiguration from form state
 * @param {Object} obj object whose state will be modified (client form component)
 * @param {string} id identifier
 * @param {string} change change of value
 * @param {Function} validationFunc validation function, retuns validation state upon change
 */
export function formChanged(obj, id, change, validationFunc) {
  const state = {
    clientConfiguration: { ...obj.state.clientConfiguration, [id]: change },
    validation: { ...obj.state.validation, [id]: validationFunc(change) }
  };
  obj.setState(state, () => {
    obj.props.configureClient && obj.props.configureClient(state);
  });
}
