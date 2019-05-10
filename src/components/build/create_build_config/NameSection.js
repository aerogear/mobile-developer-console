import React from 'react';
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import { KEY_CR_NAME, KEY_CR, ofValidation } from '../Constants';
import { createBuildConfigConnect } from './ReduxCommon';
import { configValidation } from './Validations';

const NameSection = ({ createBuildConfigState, setField }) => {
  const { [KEY_CR_NAME]: name = '' } = _get(createBuildConfigState, KEY_CR, {});
  const { [KEY_CR_NAME]: nameValidation } = _get(createBuildConfigState, ofValidation(KEY_CR), {});
  return (
    <div className="section">
      <FormGroup className="name-field" validationState={nameValidation}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl type="text" onChange={e => setField(KEY_CR_NAME, e.target.value)} value={name} />
        <HelpBlock>A name for the build</HelpBlock>
      </FormGroup>
    </div>
  );
};

export default createBuildConfigConnect(KEY_CR, configValidation, NameSection);
