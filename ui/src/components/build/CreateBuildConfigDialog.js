import React, { Component } from 'react';
import {
  Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button, Modal,
} from 'patternfly-react';
import PropTypes from 'prop-types';
import FormDropdown from '../common/FormDropdown';
import KeyValueEditor from '../common/KeyValueEditor';
import './CreateBuildConfigDialog.css';
import {
  BUILD_AUTH_TYPE_PUBLIC,
  BUILD_AUTH_TYPE_BASIC,
  BUILD_AUTH_TYPE_SSH,
  BUILD_PLATFORM_ANDROID,
  BUILD_TYPE_DEBUG,
  BUILD_PLATFORM_IOS,
  BUILD_TYPE_RELEASE,
} from './Constants';
import { SubState } from '../common/SubState';

class CreateBuildConfigDialog extends Component {
  propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    update: PropTypes.bool,
    buildConfig: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { buildConfig } = props;
    this.state = {
      config: {
        source: { authType: BUILD_AUTH_TYPE_PUBLIC, gitRef: 'master', jenkinsFilePath: '/' },
        build: { platform: BUILD_PLATFORM_ANDROID, buildType: BUILD_TYPE_DEBUG },
      },
      advancedOptions: false,
      ...buildConfig,
    };
    this.configState = new SubState(this, 'config');
    this.buildState = new SubState(this, 'config.build');
    this.basicAuthState = new SubState(this, 'config.source.basicAuth');
    this.sshAuthState = new SubState(this, 'config.source.sshAuth');
    this.sourceState = new SubState(this, 'config.source');
  }


  onSaveBuildConfig = () => {
    const { config } = this.state;
    const { onSave, update = false } = this.props;
    onSave && onSave({ update, config });
  };

  onEnvVarsChange = (rows) => {
    this.configState.set(
      'envVars',
      rows.map(({ key, value }) => ({
        name: key,
        value,
      })),
    );
  };

  cancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  renderFormButtons = (onCancel, update) => (
    <div>
      <Button onClick={this.onSaveBuildConfig}>{update ? 'Save' : 'Create'}</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  );

  renderBuildSection = () => {
    const { platform = BUILD_PLATFORM_ANDROID, buildType = BUILD_AUTH_TYPE_PUBLIC } = this.buildState.getOrEmpty();
    return (
      <div className="section">
        <h3 className="with-divider">Build Configuration</h3>
        <FormGroup>
          <ControlLabel>Platform</ControlLabel>
          <FormDropdown
            id="platform"
            items={[BUILD_PLATFORM_ANDROID, BUILD_PLATFORM_IOS]}
            titles={['Android', 'iOS']}
            onSelect={active => this.buildState.set('platform', active)}
            selected={platform}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Build Type</ControlLabel>
          <FormDropdown
            id="buildtype"
            items={[BUILD_TYPE_DEBUG, BUILD_TYPE_RELEASE]}
            titles={['Debug', 'Release']}
            onSelect={active => this.buildState.set('buildType', active)}
            selected={buildType}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Environment Variables</ControlLabel>
          <KeyValueEditor onChange={this.onEnvVarsChange} />
        </FormGroup>
      </div>
    );
  };

  renderSourceSection = () => {
    const { advancedOptions } = this.state;
    const {
      gitUrl = '', gitRef = 'master', jenkinsFilePath = '/', authType = BUILD_AUTH_TYPE_PUBLIC,
    } = this.sourceState.getOrEmpty();
    return (
      <div className="section">
        <h3 className="with-divider">Source Configuration</h3>
        <Grid fluid className="sourceSection">
          <Row>
            <Col lg={advancedOptions ? 8 : 12}>
              <FormGroup>
                <ControlLabel className="required">Git Repository URL</ControlLabel>
                <FormControl type="text" onChange={e => this.sourceState.set('gitUrl', e.target.value)} value={gitUrl} />
                <HelpBlock>Git URL of the source code to build.</HelpBlock>
                <HelpBlock>
            View the
                  {' '}
                  <a href="#" onClick={() => this.setState({ advancedOptions: true })}>advanced options</a>
                </HelpBlock>
              </FormGroup>
            </Col>

            {advancedOptions
              ? (<Col lg={4}>
                <FormGroup>
                  <ControlLabel className="required">Git Reference</ControlLabel>
                  <FormControl type="text" onChange={e => this.sourceState.set('gitRef', e.target.value)} value={gitRef} />
                </FormGroup>
              </Col>
              ) : <React.Fragment />}
          </Row>
        </Grid>
        {advancedOptions
          ? (
            <FormGroup>
              <ControlLabel className="required">Jenkins file path</ControlLabel>
              <FormControl type="text" defaultValue={jenkinsFilePath} onChange={e => this.sourceState.set('jenkinsFilePath', e.target.value)} value={jenkinsFilePath} />
            </FormGroup>
          )
          : <React.Fragment />}
        <FormGroup>
          <ControlLabel>Authentication Type</ControlLabel>
          <FormDropdown
            id="authType"
            items={[BUILD_AUTH_TYPE_PUBLIC, BUILD_AUTH_TYPE_BASIC, BUILD_AUTH_TYPE_SSH]}
            titles={['Public', 'Basic authentication', 'SSH Authentication']}
            onSelect={active => this.sourceState.set('authType', active)}
            selected={authType}
          />
        </FormGroup>
        {authType === BUILD_AUTH_TYPE_BASIC ? this.renderBasicAuthentication() : <React.Fragment />}
        {authType === BUILD_AUTH_TYPE_SSH ? this.renderSshAuthentication() : <React.Fragment />}
      </div>
    );
  };

  renderBasicAuthentication = () => {
    const { name = '', username = '', password = '' } = this.basicAuthState.getOrEmpty();
    return (
      <React.Fragment>
        <FormGroup>
          <ControlLabel className="required">Name</ControlLabel>
          <FormControl type="text" onChange={e => this.basicAuthState.set('name', e.target.value)} value={name} />
          <HelpBlock>A name for the credentials.</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel className="required">Username</ControlLabel>
          <FormControl
            type="text"
            onChange={e => this.basicAuthState.set('username', e.target.value)}
            value={username}
          />
          <HelpBlock>Username for Git authentication.</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel className="required">Password or Token</ControlLabel>
          <FormControl
            type="password"
            onChange={e => this.basicAuthState.set('password', e.target.value)}
            value={password}
          />
          <HelpBlock>Password or token for Git authentication.</HelpBlock>
        </FormGroup>
      </React.Fragment>
    );
  };

  renderSshAuthentication = () => {
    const { name = '', privateKey = '' } = this.sshAuthState.getOrEmpty();
    return (
      <React.Fragment>
        <FormGroup>
          <ControlLabel className="required">Name</ControlLabel>
          <FormControl type="text" onChange={e => this.sshAuthState.set('name', e.target.value)} value={name} />
          <HelpBlock>A name for the credentials.</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel className="required">SSH Private Key</ControlLabel>
          <FormControl type="file" />
          <HelpBlock>Upload your private SSH key file.</HelpBlock>
          <FormControl
            componentClass="textarea"
            onChange={e => this.sshAuthState.set('privateKey', e.target.value)}
            value={privateKey}
          />
          <HelpBlock>Private SSH key file for Git authentication.</HelpBlock>
        </FormGroup>
      </React.Fragment>
    );
  };

  renderNameSection = () => {
    const { name = '' } = this.configState.getOrEmpty();
    return (
      <div className="section">
        <FormGroup className="name-field">
          <ControlLabel className="required">Name</ControlLabel>
          <FormControl type="text" onChange={e => this.configState.set('name', e.target.value)} value={name} />
          <HelpBlock>A name for the build</HelpBlock>
        </FormGroup>
      </div>
    );
  };

  render() {
    const {
      show, title, onCancel, update,
    } = this.props;
    return (
      <Modal show={show} container={this}>
        <Modal.Header>
          <Modal.CloseButton onClick={onCancel} />
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <Grid fluid>
            <Row>
              <Col md={10}>
                <div className="help-block">
                  Client Build allows you to create a mobile client binary from a git source repository.
                </div>
                <Form>
                  {this.renderNameSection()}
                  {this.renderSourceSection()}
                  {this.renderBuildSection()}
                </Form>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>{this.renderFormButtons(onCancel, update)}</Modal.Footer>
      </Modal>
    );
  }
}

export default CreateBuildConfigDialog;
