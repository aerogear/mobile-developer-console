import React from 'react';
import { get as _get } from 'lodash-es';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'patternfly-react';
import {
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_USERNAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  PATH_CR_SOURCE_BASIC_AUTH,
  ofValidation
} from '../Constants';
import { createBuildConfigConnect } from './ReduxCommon';
import { basicAuthValidation } from './Validations';

const BasicAuthenticationSection = ({ createBuildConfigState, setField }) => {
  const {
    [KEY_CR_BASIC_AUTH_NAME]: name = '',
    [KEY_CR_BASIC_AUTH_USERNAME]: username = '',
    [KEY_CR_BASIC_AUTH_PASSWORD]: password = ''
  } = _get(createBuildConfigState, PATH_CR_SOURCE_BASIC_AUTH, {});
  const {
    [KEY_CR_BASIC_AUTH_NAME]: nameValidation = '',
    [KEY_CR_BASIC_AUTH_USERNAME]: usernameValidation = '',
    [KEY_CR_BASIC_AUTH_PASSWORD]: passwordValidation = ''
  } = _get(createBuildConfigState, ofValidation(PATH_CR_SOURCE_BASIC_AUTH), {});
  return (
    <React.Fragment>
      <FormGroup validationState={nameValidation}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl type="text" onChange={e => setField(KEY_CR_BASIC_AUTH_NAME, e.target.value)} value={name} />
        <HelpBlock>A name for the credentials.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={usernameValidation}>
        <ControlLabel className="required">Username</ControlLabel>
        <FormControl
          type="text"
          onChange={e => setField(KEY_CR_BASIC_AUTH_USERNAME, e.target.value)}
          value={username}
        />
        <HelpBlock>Username for Git authentication.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={passwordValidation}>
        <ControlLabel className="required">Password or Token</ControlLabel>
        <FormControl
          type="password"
          onChange={e => setField(KEY_CR_BASIC_AUTH_PASSWORD, e.target.value)}
          value={password}
        />
        <HelpBlock>Password or token for Git authentication.</HelpBlock>
      </FormGroup>
    </React.Fragment>
  );
};

export default createBuildConfigConnect(PATH_CR_SOURCE_BASIC_AUTH, basicAuthValidation, BasicAuthenticationSection);
