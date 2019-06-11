import React, { Component } from 'react';
import { Grid, Row, Col, Form, Button, Modal } from 'patternfly-react';
import './CreateBuildConfigDialog.css';
import { KEY_CR } from './Constants';
import NameSection from './create_build_config/NameSection';
import { configValidation, isAllValid, checkMandatoryFields } from './create_build_config/Validations';
import SourceSection from './create_build_config/SourceSection';
import BuildSection from './create_build_config/BuildSection';
import { createBuildConfigConnect } from './create_build_config/ReduxCommon';

export class CreateBuildConfigDialog extends Component {
  state = { valid: false };

  componentDidUpdate(prevProps) {
    this.validate();
  }

  validate() {
    const { validation = {} } = this.props.createBuildConfigState;
    const { [KEY_CR]: confValidation = {} } = validation;
    const validVal = isAllValid(confValidation) && checkMandatoryFields(this.props.createBuildConfigState);
    if (this.state.valid !== validVal) this.setState({ valid: validVal });
  }

  onSaveBuildConfig = () => {
    const { config } = this.props.createBuildConfigState;
    const { onSave } = this.props;
    onSave && onSave({ config });
  };

  renderFormButtons = (onCancel, valid) => (
    <div>
      <Button onClick={onCancel}>Cancel</Button>
      <Button bsStyle="primary" onClick={this.onSaveBuildConfig} disabled={!valid}>
        Create
      </Button>
    </div>
  );

  render() {
    const { show, title, onCancel } = this.props;
    const { valid = false } = this.state;
    return (
      <Modal show={show} container={this}>
        <Modal.Header>
          <Modal.CloseButton onClick={onCancel} />
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody buildConfigModal">
          <Grid fluid>
            <Row>
              <Col md={12}>
                <div className="help-block">
                  Client Build allows you to create a mobile client binary from a git source repository.
                </div>
                <Form>
                  <NameSection />
                  <SourceSection />
                  <BuildSection />
                </Form>
              </Col>
            </Row>
          </Grid>
        </Modal.Body>
        <Modal.Footer>{this.renderFormButtons(onCancel, valid)}</Modal.Footer>
      </Modal>
    );
  }
}

export default createBuildConfigConnect(KEY_CR, configValidation, CreateBuildConfigDialog);
