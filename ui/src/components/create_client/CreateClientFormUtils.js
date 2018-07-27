/* eslint react/prop-types: 0 */

import React from 'react';
import { Grid, Form, FieldLevelHelp, Col, Row, Button  } from 'patternfly-react'; 

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
        <Grid.Col sm={9}>
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
      <Grid.Col sm={9}>
        {formControl(controlProps)}
        {showHelp && help && <Form.HelpBlock>{help}</Form.HelpBlock>}
      </Grid.Col>
    </Form.FormGroup>
  );
};

/**
 * Renders form with some fields and button strip.
 * @param {Array} formFields 
 * @param {Array} formButtons 
 */
export function renderForm(formFields,formButtons) {
  const generatedFields = formFields.map(formField => HorizontalFormField({ ...formField}));
  const createButtons=formButtons.map(({ text, ...props }) => (
    <span key={text}>
      <Button {...props}>
        {text}
      </Button>{' '}
    </span>
  ))
  return (
      <Grid>
        <Form horizontal>
          {generatedFields}
          <Row style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            <Col smOffset={3} sm={9}>
               {createButtons}
            </Col>
          </Row>
        </Form>
      </Grid>
    );
}