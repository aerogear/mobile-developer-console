import React, { Component } from 'react';
import { FormGroup, ControlLabel, Button, Modal, Alert, Icon } from 'patternfly-react';
import PlatformItem from '../components/create_client/PlatformItem';
import PlatformItems from '../components/create_client/PlatformItems';
import CreateAndroidClient from '../components/create_client/CreateAndroidClient';
import CreateCordovaClient from '../components/create_client/CreateCordovaClient';
import CreateXamarinClient from '../components/create_client/CreateXamarinClient';
import CreateIOSClient from '../components/create_client/CreateIOSClient';
import {
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PLATFORM_CORDOVA,
  PLATFORM_XAMARIN
} from '../components/create_client/Constants';
import '../components/create_client/create_client.css';
import { MobileApp } from '../model/mobileapp';

class ClientEditBaseClass extends Component {
  constructor(props, editingMode) {
    super(props);
    this.state = {
      showModal: false,
      loading: false,
      editingMode
    };
    this.createClient = this.createClient.bind(this);
  }

  getMobileAppToEdit(newWindow) {
    if (!newWindow && this.props.apps.createClientAppDialog.app) {
      return new MobileApp({ ...this.props.apps.createClientAppDialog.app });
    } else if (this.props.item) {
      const appJson = this.props.item;
      if (appJson) {
        return new MobileApp(JSON.parse(JSON.stringify(appJson)));
      }
    }
    return null;
  }

  open = async () => {
    const app = this.getMobileAppToEdit(true);
    this.props.editApp(app);
    if (this.state.editingMode) {
      this.props.selectPlatform(app.getType());
    } else {
      this.props.selectPlatform(this.props.platforms[0]);
    }

    this.setState({
      error: null,
      showModal: true,
      loading: false
    });
  };

  createClient() {
    this.setState({ loading: true });
    const newApp = this.getMobileAppToEdit();
    if (this.state.editingMode) {
      this.props.updateApp(newApp);
    } else {
      this.props.createApp(newApp);
    }
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
  };

  renderPlatformSelection() {
    const availablePlatforms = [];
    let platform;
    if (this.state.editingMode) {
      platform = this.getMobileAppToEdit().getType();
      availablePlatforms.push(<PlatformItem type={platform} key={platform} />);
    } else {
      for (const key in this.props.platforms) {
        platform = this.props.platforms[key];
        availablePlatforms.push(<PlatformItem type={platform} key={platform} />);
      }
    }

    return (
      <FormGroup>
        <ControlLabel className="required">Application Platform</ControlLabel>
        <PlatformItems itemSelected={this.selectPlatform}>{availablePlatforms}</PlatformItems>
      </FormGroup>
    );
  }

  renderPlatform() {
    const app = this.getMobileAppToEdit();
    switch (app.getType()) {
      case PLATFORM_ANDROID:
        return <CreateAndroidClient editing={this.state.editingMode} />;
      case PLATFORM_CORDOVA:
        return <CreateCordovaClient editing={this.state.editingMode} />;
      case PLATFORM_IOS:
        return <CreateIOSClient editing={this.state.editingMode} />;
      case PLATFORM_XAMARIN:
        return <CreateXamarinClient editing={this.state.editingMode} />;
      default:
        return null;
    }
  }

  renderModal() {
    return (
      <Modal show={this.state.showModal}>
        <Modal.Header>
          <button className="close" onClick={this.close} aria-hidden="true" aria-label="Close">
            <Icon type="pf" name="close" />
          </button>
          <Modal.Title>{this.state.editingMode ? 'Edit Mobile App' : 'Create Mobile App'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.error && (
            <Alert key="123" type="error">
              {this.state.error}
            </Alert>
          )}
          <FormGroup key={this.state.selectedPlatform}>{this.renderPlatform()}</FormGroup>
          {this.renderPlatformSelection()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Cancel</Button>
          <Button bsStyle="primary" onClick={this.createClient} disabled={this.getMobileAppToEdit() && !this.getMobileAppToEdit().isValid()}>
            {this.state.editingMode ? 'Save' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        <Button bsStyle="primary" bsSize={this.props.createButtonSize} onClick={this.open}>
          Create Mobile App
        </Button>
        {this.renderModal()}
      </div>
    );
  }
}

export default ClientEditBaseClass;
