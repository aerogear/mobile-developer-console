import React from 'react';
import { get as _get } from 'lodash-es';
import { FormGroup, ControlLabel, FormControl, HelpBlock, ExpandCollapse } from 'patternfly-react';
import {
  BUILD_AUTH_TYPE_PUBLIC,
  KEY_CR_SOURCE_GITURL,
  BUILD_AUTH_TYPE_BASIC,
  BUILD_AUTH_TYPE_SSH,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  KEY_CR_SOURCE_AUTH_TYPE,
  PATH_CR_SOURCE,
  ofValidation,
  KEY_CR_SOURCE_SSH_AUTH,
  KEY_CR_SOURCE_BASIC_AUTH
} from '../Constants';
import FormDropdown from '../../common/FormDropdown';
import { sourceValidation } from './Validations';
import { createBuildConfigConnect } from './ReduxCommon';
import BasicAuthenticationSection from './BasicAuthenticationSection';
import SshAuthenticationSection from './SshAuthenticationSection';

const SourceSection = ({ createBuildConfigState, setField, removeValues }) => {
  const {
    [KEY_CR_SOURCE_GITURL]: gitUrl,
    [KEY_CR_SOURCE_GITREF]: gitRef,
    [KEY_CR_SOURCE_JENKINS_FILE_PATH]: jenkinsFilePath,
    [KEY_CR_SOURCE_AUTH_TYPE]: authType
  } = _get(createBuildConfigState, PATH_CR_SOURCE, {});
  const {
    [KEY_CR_SOURCE_GITURL]: gitUrlValidation,
    [KEY_CR_SOURCE_GITREF]: gitRefValidation,
    [KEY_CR_SOURCE_JENKINS_FILE_PATH]: jenkinsFilePathValidation
  } = _get(createBuildConfigState, ofValidation(PATH_CR_SOURCE), {});
  return (
    <div className="section">
      <h3 className="with-divider">Source Configuration</h3>
      <FormGroup validationState={gitUrlValidation}>
        <ControlLabel className="required">Git Repository URL</ControlLabel>
        <FormControl type="text" onChange={e => setField(KEY_CR_SOURCE_GITURL, e.target.value)} value={gitUrl} />
        <HelpBlock>Git URL of the source code to build.</HelpBlock>
      </FormGroup>
      <ExpandCollapse bordered textExpanded=" Hide advanced options" textCollapsed=" Show advanced options">
        <div className="advancedOptions">
          <FormGroup validationState={gitRefValidation}>
            <ControlLabel className="required">Git Reference</ControlLabel>
            <FormControl type="text" onChange={e => setField(KEY_CR_SOURCE_GITREF, e.target.value)} value={gitRef} />
          </FormGroup>
          <FormGroup validationState={jenkinsFilePathValidation}>
            <ControlLabel className="required">Jenkins file path</ControlLabel>
            <FormControl
              type="text"
              onChange={e => setField(KEY_CR_SOURCE_JENKINS_FILE_PATH, e.target.value)}
              value={jenkinsFilePath}
            />
          </FormGroup>
        </div>
      </ExpandCollapse>
      <FormGroup>
        <ControlLabel>Authentication Type</ControlLabel>
        <FormDropdown
          id="authType"
          items={[BUILD_AUTH_TYPE_PUBLIC, BUILD_AUTH_TYPE_BASIC, BUILD_AUTH_TYPE_SSH]}
          titles={['Public', 'Basic authentication', 'SSH Authentication']}
          onSelect={active => {
            removeValues(KEY_CR_SOURCE_BASIC_AUTH, KEY_CR_SOURCE_SSH_AUTH);
            setField(KEY_CR_SOURCE_AUTH_TYPE, active);
          }}
          selected={authType}
        />
      </FormGroup>
      {authType === BUILD_AUTH_TYPE_BASIC ? <BasicAuthenticationSection /> : <React.Fragment />}
      {authType === BUILD_AUTH_TYPE_SSH ? <SshAuthenticationSection /> : <React.Fragment />}
    </div>
  );
};

export default createBuildConfigConnect(PATH_CR_SOURCE, sourceValidation, SourceSection);
