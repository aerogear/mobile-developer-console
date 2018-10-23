import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormGroup, ControlLabel, Button, Modal, Alert, Icon } from 'patternfly-react';
import { createApp, registerPlatform, selectPlatform, resetForm } from '../actions/apps';
import PlatformItem from '../components/create_client/PlatformItem';
import PlatformItems from '../components/create_client/PlatformItems';
import CreateAndroidClient from '../components/create_client/CreateAndroidClient';
import CreateCordovaClient from '../components/create_client/CreateCordovaClient';
import CreateXamarinClient from '../components/create_client/CreateXamarinClient';
import CreateIOSClient from '../components/create_client/CreateIOSClient';
import { PLATFORM_ANDROID, PLATFORM_IOS, PLATFORM_CORDOVA, PLATFORM_XAMARIN } from '../components/create_client/Constants';
import '../components/create_client/create_client.css';

class CreateClient extends Component {
  constructor(props) {
    super(props);
    this.baseState = this.state;
    this.createClient = this.createClient.bind(this);
    for (var key in this.props.platforms) {
      var platform = this.props.platforms[key]
      this.props.platformReg( { name: platform, selected: false });
    }
  }

  state = {
    showModal: false,
    loading: false, 
    valid: false
  };

  open = () => {
    this.props.resetForm();
    this.props.selectPlatform(this.props.platforms[0]);

    this.setState({
      error: null,
      showModal: true, 
      loading: false,
    });
  };

  getSelectedPlatform() {
    var platforms = this.props.apps.createClientAppDialog.platforms;
    for (var platform in platforms) {
      if (platforms[platform].selected) {
        return platform;
      }
    }
  }

  createClient() {
    this.setState({ loading: true });

    var newApp = {
      name: this.props.apps.createClientAppDialog.fields.name.value,
      appIdentifier: this.props.apps.createClientAppDialog.fields.appIdentifier.value,
      clientType: this.getSelectedPlatform()
    }

    this.props.createApp(newApp);
  }

  componentDidUpdate() {
    if (this.state.loading && !this.props.apps.isCreating) {
      if (this.props.apps.createError) {
        this.setState({ error: this.props.apps.createError.message, loading: false });
      } else {
        this.setState({ showModal: false, loading: false });
      }
    }
  }

  close = () => {
    if (!this.state.loading) {
      this.setState({ showModal: false, loading: false });
    }
  }

  renderPlatformSelection() {
    var availablePlatforms = [];
    for (var key in this.props.platforms) {
      var platform = this.props.platforms[key]
      availablePlatforms.push(<PlatformItem type={platform} key={platform}/>);
    }

    return (
      <FormGroup>
        <ControlLabel className="required">
          Application Platform
        </ControlLabel>
        <PlatformItems itemSelected={this.selectPlatform} >
          {availablePlatforms}
        </PlatformItems>
      </FormGroup>
    )
  }

  renderPlatform() {
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_ANDROID].selected) {
      return <CreateAndroidClient configureClient={this.configureClient} />
    }
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_IOS].selected) {
      return <CreateIOSClient configureClient={this.configureClient} />
    }
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_CORDOVA].selected) {
      return <CreateCordovaClient configureClient={this.configureClient} />
    }
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_XAMARIN].selected) {
      return <CreateXamarinClient configureClient={this.configureClient} />
    }
  }

  render() {
    return (
      <div>
        <Button bsStyle="primary" bsSize={this.props.createButtonSize} onClick={this.open}>
          Create Mobile App
        </Button>
        <Modal show={this.state.showModal}>
          <Modal.Header>
          <button
            className="close"
            onClick={this.close}
            aria-hidden="true"
            aria-label="Close">
            <Icon type="pf" name="close" />
          </button>
            <Modal.Title>Create Mobile App</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.error && <Alert key="123" type="error">{this.state.error}</Alert>}
            <FormGroup key={this.state.selectedPlatform}>
              {this.renderPlatform()}
            </FormGroup>
            {this.renderPlatformSelection()}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.createClient} disabled={!this.props.apps.createClientAppDialog.valid} >Create</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps,
  };
}

const mapDispatchToProps = {
  createApp,
  platformReg: registerPlatform,
  selectPlatform,
  resetForm,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateClient);