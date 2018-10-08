import React from 'react';
import { KEY_CR_NAME } from '../Constants';
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'patternfly-react';

export function renderNameSection(configState) {
  const { name = '' } = configState.getOrEmpty();
  return (
    <div className="section">
      <FormGroup className="name-field" validationState={configState.getValidationState(KEY_CR_NAME)}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl type="text" onChange={e => configState.set(KEY_CR_NAME, e.target.value)} value={name} />
        <HelpBlock>A name for the build</HelpBlock>
      </FormGroup>
    </div>
  );
}
