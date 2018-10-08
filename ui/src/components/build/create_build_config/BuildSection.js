import React from 'react';
import { FormGroup, ControlLabel } from 'patternfly-react';
import {
  KEY_CR_BUILD_PLATFORM,
  KEY_CR_BUILD_TYPE,
  KEY_CR_ENV_VARS,
  BUILD_PLATFORM_ANDROID,
  BUILD_AUTH_TYPE_PUBLIC,
  BUILD_PLATFORM_IOS,
  BUILD_TYPE_RELEASE,
  BUILD_TYPE_DEBUG
} from '../Constants';
import FormDropdown from '../../common/FormDropdown';
import KeyValueEditor from '../../common/KeyValueEditor';

function onEnvVarsChange(configState, rows) {
  configState.set(
    KEY_CR_ENV_VARS,
    rows.map(({ key, value }) => ({
      name: key,
      value
    }))
  );
}

export function renderBuildSection(configState, buildState) {
  const { platform = BUILD_PLATFORM_ANDROID, buildType = BUILD_AUTH_TYPE_PUBLIC } = buildState.getOrEmpty();
  return (
    <div className="section">
      <h3 className="with-divider">Build Configuration</h3>
      <FormGroup>
        <ControlLabel>Platform</ControlLabel>
        <FormDropdown
          id="platform"
          items={[BUILD_PLATFORM_ANDROID, BUILD_PLATFORM_IOS]}
          titles={['Android', 'iOS']}
          onSelect={active => buildState.set(KEY_CR_BUILD_PLATFORM, active)}
          selected={platform}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Build Type</ControlLabel>
        <FormDropdown
          id="buildtype"
          items={[BUILD_TYPE_DEBUG, BUILD_TYPE_RELEASE]}
          titles={['Debug', 'Release']}
          onSelect={active => buildState.set(KEY_CR_BUILD_TYPE, active)}
          selected={buildType}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Environment Variables</ControlLabel>
        <KeyValueEditor onChange={rows => onEnvVarsChange(configState, rows)} />
      </FormGroup>
    </div>
  );
}
