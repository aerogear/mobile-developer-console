import React from 'react';
import { get as _get } from 'lodash-es';
import { FormGroup, ControlLabel, FormControl, HelpBlock } from 'patternfly-react';
import { KEY_CR_SSH_AUTH_NAME, KEY_CR_SSH_PRIVATE_KEY, PATH_CR_SOURCE_SSH_AUTH, ofValidation } from '../Constants';
import UploadControl from '../../common/UploadControl';
import { createBuildConfigConnect } from './ReduxCommon';
import { sshAuthValidation } from './Validations';

const SshAuthenticationSection = ({ createBuildConfigState, setField }) => {
  const { [KEY_CR_SSH_AUTH_NAME]: name = '', [KEY_CR_SSH_PRIVATE_KEY]: privateKey = '' } = _get(
    createBuildConfigState,
    PATH_CR_SOURCE_SSH_AUTH,
    {}
  );
  const { [KEY_CR_SSH_AUTH_NAME]: nameValidation = '', [KEY_CR_SSH_PRIVATE_KEY]: privateKeyValidation = '' } = _get(
    createBuildConfigState,
    ofValidation(PATH_CR_SOURCE_SSH_AUTH),
    {}
  );
  return (
    <React.Fragment>
      <FormGroup validationState={nameValidation}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl type="text" onChange={e => setField(KEY_CR_SSH_AUTH_NAME, e.target.value)} value={name} />
        <HelpBlock>A name for the credentials.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={privateKeyValidation}>
        <ControlLabel className="required">SSH Private Key</ControlLabel>
        <UploadControl onTextLoaded={text => setField(KEY_CR_SSH_PRIVATE_KEY, text)} />
        <HelpBlock>Upload your private SSH key file.</HelpBlock>
        <FormControl
          componentClass="textarea"
          onChange={e => setField(KEY_CR_SSH_PRIVATE_KEY, e.target.value)}
          value={privateKey}
        />
        <HelpBlock>Private SSH key file for Git authentication.</HelpBlock>
      </FormGroup>
    </React.Fragment>
  );
};

export default createBuildConfigConnect(PATH_CR_SOURCE_SSH_AUTH, sshAuthValidation, SshAuthenticationSection);
