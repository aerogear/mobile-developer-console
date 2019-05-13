import React from 'react';
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import {
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS,
  PATH_CR_BUILD_ANDROID_CREDENTIALS,
  ofValidation
} from '../Constants';
import UploadControl from '../../common/UploadControl';
import { createBuildConfigConnect } from './ReduxCommon';
import { androidCredentialsValidation } from './Validations';

const AndroidCredentialsSection = ({ createBuildConfigState, setField, setUiState }) => {
  const {
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME]: name,
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS]: keystoreAlias,
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD]: password
  } = _get(createBuildConfigState, PATH_CR_BUILD_ANDROID_CREDENTIALS, {});
  const {
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME]: nameValidation,
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE]: keystoreValidation,
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS]: keystoreAliasValidation,
    [KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD]: passwordValidation
  } = _get(createBuildConfigState, ofValidation(PATH_CR_BUILD_ANDROID_CREDENTIALS), {});

  return (
    <div>
      <FormGroup validationState={nameValidation}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl
          type="text"
          onChange={e => setField(KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME, e.target.value)}
          value={name}
        />
        <HelpBlock>A name for the credentials.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={keystoreValidation}>
        <ControlLabel className="required">Android Keystore</ControlLabel>
        <UploadControl
          onTextLoaded={text =>
            setField(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE, Buffer.from(text).toString('base64'))
          }
        />
        <HelpBlock>Password protected PKCS12 file containing a key protected by the same password.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={passwordValidation}>
        <ControlLabel className="required">Android Keystore Password</ControlLabel>
        <FormControl
          type="password"
          onChange={e => setField(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD, e.target.value)}
          value={password}
        />
        <HelpBlock>Password for the PKCS12 archive and key.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={keystoreAliasValidation}>
        <ControlLabel className="required">Keystore Alias</ControlLabel>
        <FormControl
          type="input"
          onChange={e => setField(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS, e.target.value)}
          value={keystoreAlias}
        />
        <HelpBlock>
          The entry name of the private key/certificate chain you want to use to sign your APK(s). This entry must exist
          in the key store uploaded. If your key store contains only one key entry, which is the most common case, you
          can leave this field blank.
        </HelpBlock>
      </FormGroup>
    </div>
  );
};
export default createBuildConfigConnect(
  PATH_CR_BUILD_ANDROID_CREDENTIALS,
  androidCredentialsValidation,
  AndroidCredentialsSection
);
