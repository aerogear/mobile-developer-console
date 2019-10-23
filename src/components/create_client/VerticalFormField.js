/* eslint react/prop-types: 0 */

import React from 'react';
// import { Form, FieldLevelHelp } from 'patternfly-react';
import { FormGroup, TextInput } from '@patternfly/react-core';

export const VerticalFormField = ({
  controlId,
  label,
  help,
  formControl,
  validationState,
  isValidState,
  bsSize,
  placeholder,
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

  // const htmlContent = (
  //   <div
  //     dangerouslySetInnerHTML={{
  //       __html: content
  //     }}
  //   />
  // );

  // const helpControl = (
  //   <Form.ControlLabel>
  //     <FieldLevelHelp content={htmlContent} close={close} />
  //   </Form.ControlLabel>
  // );

  return (
    // <Form.FormGroup {...formGroupProps}>
    //   {label && <Form.ControlLabel>{label}</Form.ControlLabel>}
    //   {useFieldLevelHelp && helpControl}
    //   {formControl(controlProps)}
    //   {showHelp && help && <Form.HelpBlock>{help}</Form.HelpBlock>}
    // </Form.FormGroup>
    <FormGroup
      {...formGroupProps}
      label={label}
      isRequired
      isValid={!showHelp}
      fieldId={controlId}
      helperTextInvalid={help}
    >
      {formControl(controlProps)}
      <TextInput
        isRequired
        isValid={!showHelp}
        placeholder={placeholder}
        type="text"
        id={controlId}
        name="simple-form-name"
        aria-describedby="form-helper"
      />
    </FormGroup>
  );
};
