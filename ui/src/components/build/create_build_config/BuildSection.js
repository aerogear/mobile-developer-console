import React from 'react';
import { FormGroup, FormControl, HelpBlock, ControlLabel } from 'patternfly-react';
import {
  KEY_CR_BUILD_PLATFORM,
  KEY_CR_BUILD_TYPE,
  KEY_CR_ENV_VARS,
  BUILD_PLATFORM_ANDROID,
  BUILD_PLATFORM_IOS,
  BUILD_TYPE_RELEASE,
  BUILD_TYPE_DEBUG,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS,
  KEY_CR_BUILD_IOS_CREDENTIALS_NAME,
  KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE,
  KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD,
  KEY_HIDE_PLATDORM
} from '../Constants';
import FormDropdown from '../../common/FormDropdown';
import KeyValueEditor from '../../common/KeyValueEditor';
import { Checkbox } from 'patternfly-react/dist/js/components/Form';
import UploadControl from '../../common/UploadControl';

function onEnvVarsChange(configState, rows) {
  configState.set(
    KEY_CR_ENV_VARS,
    rows.map(({ key, value }) => ({
      name: key,
      value
    }))
  );
}

export function renderBuildSection(component) {
  const { configState, buildState } = component;
  const { externalCredentials, [KEY_HIDE_PLATDORM]: hidePlatform } = component.state;
  const { platform = BUILD_PLATFORM_ANDROID, buildType = BUILD_TYPE_DEBUG } = buildState.getOrEmpty();
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
            onSelect={active => buildState.set(KEY_CR_BUILD_PLATFORM, active)}
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
          onSelect={active => buildState.set(KEY_CR_BUILD_TYPE, active)}
          selected={buildType}
        />
      </FormGroup>
      {platform === BUILD_PLATFORM_ANDROID && buildType === BUILD_TYPE_RELEASE ? (
        <FormGroup>
          <Checkbox
            checked={externalCredentials}
            onChange={e => component.setState({ externalCredentials: e.target.value })}
          >
            Upload external credentials (Use this option if your Keystore is external to your source code)
          </Checkbox>
        </FormGroup>
      ) : (
        <React.Fragment />
      )}
      {platform === BUILD_PLATFORM_IOS ? renderIOSCredentials(component) : <React.Fragment />}
      {externalCredentials ? renderAndroidCredentials(component) : <React.Fragment />}
      <FormGroup>
        <ControlLabel>Environment Variables</ControlLabel>
        <KeyValueEditor onChange={rows => onEnvVarsChange(configState, rows)} />
      </FormGroup>
    </div>
  );
}

function renderAndroidCredentials(component) {
  const { androidCredentialsState } = component;
  return (
    <div>
      <FormGroup validationState={androidCredentialsState.getValidationState(KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME)}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl
          type="text"
          onChange={e => androidCredentialsState.set(KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME, e.target.value)}
          value={androidCredentialsState.get(KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME)}
        />
        <HelpBlock>A name for the credentials.</HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={androidCredentialsState.getValidationState(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE)}
      >
        <ControlLabel className="required">Android Keystore</ControlLabel>
        <UploadControl
          onTextLoaded={text =>
            androidCredentialsState.set(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE, Buffer.from(text).toString('base64'))
          }
        />
        <HelpBlock>Password protected PKCS12 file containing a key protected by the same password.</HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={androidCredentialsState.getValidationState(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD)}
      >
        <ControlLabel className="required">Android Keystore Password</ControlLabel>
        <FormControl
          type="password"
          onChange={e =>
            androidCredentialsState.set(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD, e.target.value)
          }
          value={androidCredentialsState.get(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD)}
        />
        <HelpBlock>Password for the PKCS12 archive and key.</HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={androidCredentialsState.getValidationState(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS)}
      >
        <ControlLabel className="required">Keystore Alias</ControlLabel>
        <FormControl
          type="input"
          onChange={e => androidCredentialsState.set(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS, e.target.value)}
          value={androidCredentialsState.get(KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS)}
        />
        <HelpBlock>
          The entry name of the private key/certificate chain you want to use to sign your APK(s). This entry must exist
          in the key store uploaded. If your key store contains only one key entry, which is the most common case, you
          can leave this field blank.
        </HelpBlock>
      </FormGroup>
    </div>
  );
}

function renderIOSCredentials(component) {
  const { iOSCredentialsState } = component;
  return (
    <div>
      <FormGroup validationState={iOSCredentialsState.getValidationState(KEY_CR_BUILD_IOS_CREDENTIALS_NAME)}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl
          type="text"
          onChange={e => iOSCredentialsState.set(KEY_CR_BUILD_IOS_CREDENTIALS_NAME, e.target.value)}
          value={iOSCredentialsState.get(KEY_CR_BUILD_IOS_CREDENTIALS_NAME)}
        />
        <HelpBlock>A name for the iOS credentials.</HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={iOSCredentialsState.getValidationState(KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE)}
      >
        <ControlLabel className="required">Apple Developer Profile</ControlLabel>
        <UploadControl
          onTextLoaded={text =>
            iOSCredentialsState.set(
              KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE,
              Buffer.from(text).toString('base64')
            )
          }
        />
        <HelpBlock>
          A developer profile file (*.developerprofile) which contains a code signing private key, corresponding
          developer/distribution certificates, and mobile provisioning profiles. For more information, see this
          documentation on exporting developer accounts in XCode.
        </HelpBlock>
      </FormGroup>
      <FormGroup
        validationState={iOSCredentialsState.getValidationState(KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD)}
      >
        <ControlLabel>Apple Developer Profile Password</ControlLabel>
        <FormControl
          type="password"
          onChange={e => iOSCredentialsState.set(KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD, e.target.value)}
          value={iOSCredentialsState.get(KEY_CR_BUILD_IOS_CREDENTIALS_PROFILE_PASSWORD)}
        />
        <HelpBlock>Password for the developer profile key, certs and provisioning profiles</HelpBlock>
      </FormGroup>
    </div>
  );
}
