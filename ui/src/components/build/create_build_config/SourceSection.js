import React from 'react';

import {
  BUILD_AUTH_TYPE_PUBLIC,
  KEY_CR_SOURCE_GITURL,
  BUILD_AUTH_TYPE_BASIC,
  BUILD_AUTH_TYPE_SSH,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  KEY_CR_SOURCE_AUTH_TYPE,
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_USERNAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  KEY_CR_SSH_AUTH_NAME,
  KEY_CR_SSH_PRIVATE_KEY,
  KEY_ADVANCED_OPTIONS
} from '../Constants';
import { Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock } from 'patternfly-react';
import FormDropdown from '../../common/FormDropdown';

export function renderSourceSection(component, sourceState, basicAuthState, sshAuthState) {
  const { advancedOptions } = component.state;
  const { update } = component.props;
  const { gitUrl, gitRef, jenkinsFilePath, authType } = sourceState.getOrEmpty();
  const gitRefValue = { [update ? 'value' : 'defaultValue']: gitRef };
  const jenkinsFilePathValue = { [update ? 'value' : 'defaultValue']: jenkinsFilePath };
  return (
    <div className="section">
      <h3 className="with-divider">Source Configuration</h3>
      <Grid fluid className="sourceSection">
        <Row>
          <Col lg={advancedOptions ? 8 : 12}>
            <FormGroup validationState={sourceState.getValidationState(KEY_CR_SOURCE_GITURL)}>
              <ControlLabel className="required">Git Repository URL</ControlLabel>
              <FormControl
                type="text"
                onChange={e => sourceState.set(KEY_CR_SOURCE_GITURL, e.target.value)}
                value={gitUrl}
              />
              <HelpBlock>Git URL of the source code to build.</HelpBlock>
              <HelpBlock>
                View the{' '}
                <a href="#" onClick={() => component.setState({ [KEY_ADVANCED_OPTIONS]: !advancedOptions })}>
                  advanced options
                </a>
              </HelpBlock>
            </FormGroup>
          </Col>

          {advancedOptions ? (
            <Col lg={4}>
              <FormGroup validationState={sourceState.getValidationState(KEY_CR_SOURCE_GITREF)}>
                <ControlLabel className="required">Git Reference</ControlLabel>
                <FormControl
                  type="text"
                  onChange={e => sourceState.set(KEY_CR_SOURCE_GITREF, e.target.value)}
                  {...gitRefValue}
                />
              </FormGroup>
            </Col>
          ) : (
            <React.Fragment />
          )}
        </Row>
      </Grid>
      {advancedOptions ? (
        <FormGroup validationState={sourceState.getValidationState(KEY_CR_SOURCE_JENKINS_FILE_PATH)}>
          <ControlLabel className="required">Jenkins file path</ControlLabel>
          <FormControl
            type="text"
            onChange={e => sourceState.set(KEY_CR_SOURCE_JENKINS_FILE_PATH, e.target.value)}
            {...jenkinsFilePathValue}
          />
        </FormGroup>
      ) : (
        <React.Fragment />
      )}
      <FormGroup>
        <ControlLabel>Authentication Type</ControlLabel>
        <FormDropdown
          id="authType"
          items={[BUILD_AUTH_TYPE_PUBLIC, BUILD_AUTH_TYPE_BASIC, BUILD_AUTH_TYPE_SSH]}
          titles={['Public', 'Basic authentication', 'SSH Authentication']}
          onSelect={active => sourceState.set(KEY_CR_SOURCE_AUTH_TYPE, active)}
          selected={authType}
        />
      </FormGroup>
      {authType === BUILD_AUTH_TYPE_BASIC ? renderBasicAuthentication(basicAuthState) : <React.Fragment />}
      {authType === BUILD_AUTH_TYPE_SSH ? renderSshAuthentication(sshAuthState) : <React.Fragment />}
    </div>
  );
}

export function renderBasicAuthentication(basicAuthState) {
  const { name = '', username = '', password = '' } = basicAuthState.getOrEmpty();
  return (
    <React.Fragment>
      <FormGroup validationState={basicAuthState.getValidationState(KEY_CR_BASIC_AUTH_NAME)}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl
          type="text"
          onChange={e => basicAuthState.set(KEY_CR_BASIC_AUTH_NAME, e.target.value)}
          value={name}
        />
        <HelpBlock>A name for the credentials.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={basicAuthState.getValidationState(KEY_CR_BASIC_AUTH_USERNAME)}>
        <ControlLabel className="required">Username</ControlLabel>
        <FormControl
          type="text"
          onChange={e => basicAuthState.set(KEY_CR_BASIC_AUTH_USERNAME, e.target.value)}
          value={username}
        />
        <HelpBlock>Username for Git authentication.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={basicAuthState.getValidationState(KEY_CR_BASIC_AUTH_PASSWORD)}>
        <ControlLabel className="required">Password or Token</ControlLabel>
        <FormControl
          type="password"
          onChange={e => basicAuthState.set(KEY_CR_BASIC_AUTH_PASSWORD, e.target.value)}
          value={password}
        />
        <HelpBlock>Password or token for Git authentication.</HelpBlock>
      </FormGroup>
    </React.Fragment>
  );
}

export function renderSshAuthentication(sshAuthState) {
  const { name = '', privateKey = '' } = sshAuthState.getOrEmpty();
  return (
    <React.Fragment>
      <FormGroup validationState={sshAuthState.getValidationState(KEY_CR_SSH_AUTH_NAME)}>
        <ControlLabel className="required">Name</ControlLabel>
        <FormControl type="text" onChange={e => sshAuthState.set(KEY_CR_SSH_AUTH_NAME, e.target.value)} value={name} />
        <HelpBlock>A name for the credentials.</HelpBlock>
      </FormGroup>
      <FormGroup validationState={sshAuthState.getValidationState(KEY_CR_SSH_PRIVATE_KEY)}>
        <ControlLabel className="required">SSH Private Key</ControlLabel>
        <FormControl type="file" />
        <HelpBlock>Upload your private SSH key file.</HelpBlock>
        <FormControl
          componentClass="textarea"
          onChange={e => sshAuthState.set(KEY_CR_SSH_PRIVATE_KEY, e.target.value)}
          value={privateKey}
        />
        <HelpBlock>Private SSH key file for Git authentication.</HelpBlock>
      </FormGroup>
    </React.Fragment>
  );
}
