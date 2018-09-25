import React, { Component } from 'react';
import { Grid, Row, Col, Form, FormGroup, ControlLabel, FormControl, HelpBlock, Button } from 'patternfly-react';
import FormDropdown from '../common/FormDropdown';
import KeyValueEditor from '../common/KeyValueEditor';

import './CreateClientBuild.css';

const nameSection = (
  <div className="section">
    <FormGroup className="name-field">
      <ControlLabel className="required">Name</ControlLabel>
      <FormControl type="text" />
      <HelpBlock>A name for the build</HelpBlock>
    </FormGroup>
  </div>
);

const basicAuthentication = (
  <React.Fragment>
    <FormGroup>
      <ControlLabel className="required">Name</ControlLabel>
      <FormControl type="text" />
      <HelpBlock>A name for the credentials.</HelpBlock>
    </FormGroup>
    <FormGroup>
      <ControlLabel className="required">Username</ControlLabel>
      <FormControl type="text" />
      <HelpBlock>Username for Git authentication.</HelpBlock>
    </FormGroup>
    <FormGroup>
      <ControlLabel className="required">Password or Token</ControlLabel>
      <FormControl type="password" />
      <HelpBlock>Password or token for Git authentication.</HelpBlock>
    </FormGroup>
  </React.Fragment>
);

const sshAuthentication = (
  <React.Fragment>
    <FormGroup>
      <ControlLabel className="required">Name</ControlLabel>
      <FormControl type="text" />
      <HelpBlock>A name for the credentials.</HelpBlock>
    </FormGroup>
    <FormGroup>
      <ControlLabel className="required">SSH Private Key</ControlLabel>
      <FormControl type="file" />
      <HelpBlock>Upload your private SSH key file.</HelpBlock>
      <FormControl componentClass="textarea" />
      <HelpBlock>Private SSH key file for Git authentication.</HelpBlock>
    </FormGroup>
  </React.Fragment>
);

const sourceSection = component => (
  <div className="section">
    <h3 className="with-divider">Source Configuration</h3>
    <FormGroup>
      <ControlLabel className="required">Git Repository URL</ControlLabel>
      <FormControl type="text" />
      <HelpBlock>Git URL of the source code to build.</HelpBlock>
      <HelpBlock>
        View the <a>advanced options</a>
      </HelpBlock>
    </FormGroup>
    <FormGroup>
      <ControlLabel>Authentication Type</ControlLabel>
      <FormDropdown
        id="authtype"
        items={['Public', 'Basic Authentication', 'SSH Key']}
        onSelect={active => component.setState({ authType: active })}
      />
    </FormGroup>
    {component.state.authType === 1 ? basicAuthentication : <React.Fragment />}
    {component.state.authType === 2 ? sshAuthentication : <React.Fragment />}
  </div>
);

const buildSection = (
  <div className="section">
    <h3 className="with-divider">Build Configuration</h3>
    <FormGroup>
      <ControlLabel>Platform</ControlLabel>
      <FormDropdown id="platform" items={['Android', 'iOS']} />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Build Type</ControlLabel>
      <FormDropdown id="buildtype" items={['Debug', 'Release']} />
    </FormGroup>
    <FormGroup>
      <ControlLabel>Environment Variables</ControlLabel>
      <KeyValueEditor />
    </FormGroup>
  </div>
);

class CreateClientBuild extends Component {
  constructor(props) {
    super(props);

    this.state = { authType: 0 };
  }

  render = () => (
    <Grid fluid className="surface-shaded">
      <Row>
        <Col md={10}>
          <h1>Create Client Build</h1>
          <div className="help-block">
            Client Build allows you to create a mobile client binary from a git source repository.
          </div>
          <Form>
            {nameSection}
            {sourceSection(this)}
            {buildSection}
            <div className="gutter-top-bottom">
              <Button bsStyle="primary">Create</Button>
              <Button>Cancel</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Grid>
  );
}

export default CreateClientBuild;
