import React from 'react';
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import {
  KEY_CR_BUILD_IOS_CREDENTIALS_NAME,
  KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE,
  KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD,
  PATH_CR_BUILD_IOS_CREDENTIALS,
  ofValidation
} from '../Constants';
import UploadControl from '../../common/UploadControl';
import { createBuildConfigConnect } from './ReduxCommon';
import { iOSCredentialsValidation } from './Validations';

const IOSCredentialSection = ({ createBuildConfigState, setField, setUiState }) => {
  const { [KEY_CR_BUILD_IOS_CREDENTIALS_NAME]: name, [KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD]: password } = _get(
    createBuildConfigState,
    PATH_CR_BUILD_IOS_CREDENTIALS,
    {}
  );
  const {
    [KEY_CR_BUILD_IOS_CREDENTIALS_NAME]: nameValidation,
    [KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE]: developerProfileValidation,
    [KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD]: passwordValidation
  } = _get(createBuildConfigState, ofValidation(PATH_CR_BUILD_IOS_CREDENTIALS), {});

  return (
    <div>
      <FormGroup validationState={nameValidation}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl
          type="text"
          onChange={e => setField(KEY_CR_BUILD_IOS_CREDENTIALS_NAME, e.target.value)}
          value={name}
        />
        <HelpBlock>A name for the iOS credentials.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={developerProfileValidation}>
        <ControlLabel className="required">Apple Developer Profile</ControlLabel>
        <UploadControl
          onTextLoaded={text =>
            setField(KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE, Buffer.from(text).toString('base64'))
          }
        />
        <HelpBlock>
          A developer profile file (*.developerprofile) which contains a code signing private key, corresponding
          developer/distribution certificates, and mobile provisioning profiles. For more information, see this
          documentation on exporting developer accounts in XCode.
        </HelpBlock>
      </FormGroup>
      <FormGroup validationState={passwordValidation}>
        <ControlLabel>Apple Developer Profile Password</ControlLabel>
        <FormControl
          type="password"
          onChange={e => setField(KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD, e.target.value)}
          value={password}
        />
        <HelpBlock>Password for the developer profile key, certs and provisioning profiles</HelpBlock>
      </FormGroup>
    </div>
  );
};

export default createBuildConfigConnect(PATH_CR_BUILD_IOS_CREDENTIALS, iOSCredentialsValidation, IOSCredentialSection);
