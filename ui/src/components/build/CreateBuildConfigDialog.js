import React, { Component } from 'react';
import { Grid, Row, Col, Form, Button, Modal } from 'patternfly-react';
import PropTypes from 'prop-types';
import './CreateBuildConfigDialog.css';
import {
  BUILD_AUTH_TYPE_PUBLIC,
  BUILD_PLATFORM_ANDROID,
  BUILD_TYPE_DEBUG,
  KEY_CR_CLIENT_ID,
  KEY_CR_CLIENT_TYPE,
  KEY_ADVANCED_OPTIONS,
  KEY_CR_SOURCE,
  KEY_CR_SOURCE_AUTH_TYPE,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_BUILD,
  KEY_CR_BUILD_PLATFORM,
  KEY_CR_BUILD_TYPE,
  BUILD_AUTH_TYPE_BASIC,
  BUILD_AUTH_TYPE_SSH,
  KEY_CR_NAME,
  KEY_CR_SOURCE_GITURL,
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  KEY_CR_BASIC_AUTH_USERNAME,
  KEY_CR_SSH_AUTH_NAME,
  KEY_CR_SSH_PRIVATE_KEY,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS,
  KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD,
  KEY_CR_BUILD_IOS_CREDENTIALS,
  KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE,
  KEY_CR_BUILD_IOS_CREDENTIALS_NAME
} from './Constants';
import { SubState } from '../common/SubState';
import { renderNameSection } from './create_build_config/NameSection';
import {
  configValidation,
  buildValidation,
  sourceValidation,
  basicAuthValidation,
  sshAuthValidation,
  androidCredentialsValidation,
  iOSCredentialsValidation
} from './create_build_config/Validations';
import { renderSourceSection } from './create_build_config/SourceSection';
import { renderBuildSection } from './create_build_config/BuildSection';
import { isEqual } from 'lodash-es';

class CreateBuildConfigDialog extends Component {
  propTypes = {
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    update: PropTypes.bool,
    config: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      valid: false,
      config: {
        [KEY_CR_SOURCE]: {
          [KEY_CR_SOURCE_AUTH_TYPE]: BUILD_AUTH_TYPE_PUBLIC,
          [KEY_CR_SOURCE_GITREF]: 'master',
          [KEY_CR_SOURCE_JENKINS_FILE_PATH]: './'
        },
        [KEY_CR_BUILD]: { [KEY_CR_BUILD_PLATFORM]: BUILD_PLATFORM_ANDROID, [KEY_CR_BUILD_TYPE]: BUILD_TYPE_DEBUG },
        ...this.props.config
      },
      [KEY_ADVANCED_OPTIONS]: false
    };

    this.configState = new SubState(this, 'config', configValidation, [KEY_CR_NAME]);
    this.buildState = new SubState(this, 'config.build', buildValidation);
    this.basicAuthState = new SubState(this, 'config.source.basicAuth', basicAuthValidation, [
      KEY_CR_BASIC_AUTH_NAME,
      KEY_CR_BASIC_AUTH_PASSWORD,
      KEY_CR_BASIC_AUTH_USERNAME
    ]);
    this.sshAuthState = new SubState(this, 'config.source.sshAuth', sshAuthValidation, [
      KEY_CR_SSH_AUTH_NAME,
      KEY_CR_SSH_PRIVATE_KEY
    ]);
    this.sourceState = new SubState(this, 'config.source', sourceValidation, [KEY_CR_SOURCE_GITURL]);
    this.androidCredentialsState = new SubState(this, 'config.build.androidCredentials', androidCredentialsValidation, [
      KEY_CR_BUILD_ANDROID_CREDENTIALS_NAME,
      KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE,
      KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_ALIAS,
      KEY_CR_BUILD_ANDROID_CREDENTIALS_KEYSTORE_PASSWORD
    ]);
    this.iOSCredentialsState = new SubState(this, 'config.build.iosCredentials', iOSCredentialsValidation, [
      KEY_CR_BUILD_IOS_CREDENTIALS,
      KEY_CR_BUILD_IOS_CREDENTIALS_DEVELOPER_PROFILE,
      KEY_CR_BUILD_IOS_CREDENTIALS_NAME
    ]);
  }

  componentDidUpdate(prevProps) {
    this.validate();
    const { config: prevConfig = {} } = prevProps;
    const { config = {} } = this.props;
    if (!isEqual(prevConfig, config)) {
      this.configState.set(KEY_CR_CLIENT_ID, config[KEY_CR_CLIENT_ID]);
      this.configState.set(KEY_CR_CLIENT_TYPE, config[KEY_CR_CLIENT_TYPE]);
    }
  }

  validate() {
    let validVal = this.configState.isAllValid() && this.buildState.isAllValid() && this.sourceState.isAllValid();
    if (this.sourceState.get(KEY_CR_SOURCE_AUTH_TYPE) === BUILD_AUTH_TYPE_BASIC)
      validVal = validVal && this.basicAuthState.isAllValid();
    if (this.sourceState.get(KEY_CR_SOURCE_AUTH_TYPE) === BUILD_AUTH_TYPE_SSH)
      validVal = validVal && this.sshAuthState.isAllValid();
    if (this.state.valid !== validVal) this.setState({ valid: validVal });
  }

  onSaveBuildConfig = () => {
    const { config } = this.state;
    const { onSave, update = false } = this.props;
    onSave && onSave({ update, config });
  };

  cancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  renderFormButtons = (onCancel, update, valid) => (
    <div>
      <Button bsStyle="primary" onClick={this.onSaveBuildConfig} disabled={!valid}>
        {update ? 'Save' : 'Create'}
      </Button>
      <Button onClick={onCancel}>Cancel</Button>
    </div>
  );

  getValidationState = () => {};

  render() {
    const { show, title, onCancel, update } = this.props;
    const { valid = false } = this.state;
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
                  {renderNameSection(this.configState)}
                  {renderSourceSection(this)}
                  {renderBuildSection(this)}
                </Form>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>{this.renderFormButtons(onCancel, update, valid)}</Modal.Footer>
      </Modal>
    );
  }
}

export default CreateBuildConfigDialog;
