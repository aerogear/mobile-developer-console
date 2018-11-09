import React from 'react';
import { FormGroup, ControlLabel, Checkbox } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import {
  KEY_CR_BUILD_PLATFORM,
  KEY_CR_BUILD_TYPE,
  KEY_CR_ENV_VARS,
  BUILD_PLATFORM_ANDROID,
  BUILD_PLATFORM_IOS,
  BUILD_TYPE_RELEASE,
  BUILD_TYPE_DEBUG,
  KEY_HIDE_PLATFORM,
  PATH_CR_BUILD,
  KEY_UI,
  KEY_EXTERNAL_CREDENTIALS
} from '../Constants';
import FormDropdown from '../../common/FormDropdown';
import KeyValueEditor from '../../common/KeyValueEditor';
import { createBuildConfigConnect } from './ReduxCommon';
import { buildValidation } from './Validations';
import IOSCredentialsSection from './IOSCredentialsSection';
import AndroidCredentialsSection from './AndroidCredentialsSection';

function onEnvVarsChange(setField, rows) {
  setField(
    KEY_CR_ENV_VARS,
    rows.map(({ key, value }) => ({
      name: key,
      value
    }))
  );
}

const BuildSection = ({ createBuildConfigState, setField, setUiState }) => {
  const { [KEY_HIDE_PLATFORM]: hidePlatform, [KEY_EXTERNAL_CREDENTIALS]: externalCredentials } = _get(
    createBuildConfigState,
    KEY_UI,
    {}
  );
  const {
    [KEY_CR_BUILD_PLATFORM]: platform = BUILD_PLATFORM_ANDROID,
    [KEY_CR_BUILD_TYPE]: buildType = BUILD_TYPE_DEBUG
  } = _get(createBuildConfigState, PATH_CR_BUILD, {});
  return (
    <div className="section">
      <h3 className="with-divider">Build Configuration</h3>
      {hidePlatform ? (
        <React.Fragment />
      ) : (
        <FormGroup>
          <ControlLabel>Platform</ControlLabel>
          <FormDropdown
            id="platform"
            items={[BUILD_PLATFORM_ANDROID, BUILD_PLATFORM_IOS]}
            titles={['Android', 'iOS']}
            onSelect={active => setField(KEY_CR_BUILD_PLATFORM, active)}
            selected={platform}
          />
        </FormGroup>
      )}
      <FormGroup>
        <ControlLabel>Build Type</ControlLabel>
        <FormDropdown
          id="buildtype"
          items={[BUILD_TYPE_DEBUG, BUILD_TYPE_RELEASE]}
          titles={['Debug', 'Release']}
          onSelect={active => setField(KEY_CR_BUILD_TYPE, active)}
          selected={buildType}
        />
      </FormGroup>
      {platform === BUILD_PLATFORM_ANDROID && buildType === BUILD_TYPE_RELEASE ? (
        <FormGroup>
          <Checkbox checked={externalCredentials} onChange={e => setUiState(KEY_EXTERNAL_CREDENTIALS, e.target.value)}>
            Upload external credentials (Use this option if your Keystore is external to your source code)
          </Checkbox>
        </FormGroup>
      ) : (
        <React.Fragment />
      )}
      {platform === BUILD_PLATFORM_IOS ? <IOSCredentialsSection /> : <React.Fragment />}
      {externalCredentials === 'on' ? <AndroidCredentialsSection /> : <React.Fragment />}
      <FormGroup>
        <ControlLabel>Environment Variables</ControlLabel>
        <KeyValueEditor onChange={rows => onEnvVarsChange(setField, rows)} />
      </FormGroup>
    </div>
  );
};

export default createBuildConfigConnect(PATH_CR_BUILD, buildValidation, BuildSection);
