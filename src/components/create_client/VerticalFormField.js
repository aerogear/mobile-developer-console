import React from 'react';
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

  return (
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
