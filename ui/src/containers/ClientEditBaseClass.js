import React, { Component } from 'react';
import { FormGroup, ControlLabel, Button, Modal, Alert, Icon } from 'patternfly-react';
import PlatformItem from '../components/create_client/PlatformItem';
import PlatformItems from '../components/create_client/PlatformItems';
import CreateAndroidClient from '../components/create_client/CreateAndroidClient';
import CreateCordovaClient from '../components/create_client/CreateCordovaClient';
import CreateXamarinClient from '../components/create_client/CreateXamarinClient';
import CreateIOSClient from '../components/create_client/CreateIOSClient';
import { PLATFORM_ANDROID, PLATFORM_IOS, PLATFORM_CORDOVA, PLATFORM_XAMARIN } from '../components/create_client/Constants';
import '../components/create_client/create_client.css';

class ClientEditBaseClass extends Component {
  constructor(props, editingMode) {
    super(props);
    this.state = {
      showModal: false,
      loading: false, 
      valid: false
    };
    this.createClient = this.createClient.bind(this);
    
    if (editingMode) {
      var app = this.getAppToEdit();

      this.state = { ...this.state, 
        editingMode: editingMode,
      };
      this.props.registerPlatform( { name: app.spec.clientType, selected: true });
    } else {
      for (var key in this.props.platforms) {
        var platform = this.props.platforms[key]
        this.props.registerPlatform( { name: platform, selected: false });
      }
    }
  }

  getAppToEdit() {
    if (this.props.itemName) {
      var index = this.props.apps.items.findIndex(item => item.metadata.name === this.props.itemName);
      return this.props.apps.items[index];  
    }
    return null;
  }


  open = async () => {
    if (this.state.editingMode) {
      var platform = this.getAppToEdit().spec.clientType;
      this.props.selectPlatform(platform)
    } else {
      this.props.resetForm();
      this.props.selectPlatform(this.props.platforms[0]);
    }

    this.setState({
      error: null,
      showModal: true, 
      loading: false,
    });
  };

  getSelectedPlatform() {
    if (this.state.editingMode) {
      return this.getAppToEdit().spec.clientType;
    } else {
      var platforms = this.props.apps.createClientAppDialog.platforms;
      return Object.keys(platforms).filter(function(key) {
        return platforms[key].selected;
      })[0];
    }
  }

  createClient() {
    this.setState({ loading: true });

    var newApp = {
      name: this.props.apps.createClientAppDialog.fields.name.value,
      appIdentifier: this.props.apps.createClientAppDialog.fields.appIdentifier.value,
      clientType: this.getSelectedPlatform()
    }

    if (this.state.editingMode) {
      this.props.updateApp(this.getAppToEdit().metadata.name, newApp);
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
  }

  renderPlatformSelection() {
    var availablePlatforms = [];

    if (this.state.editingMode) {
      var index = this.props.apps.items.findIndex(item => item.metadata.name === this.props.itemName);
      var platform = this.props.apps.items[index].spec.clientType;
      availablePlatforms.push(<PlatformItem type={platform} key={platform}/>);
    } else {
      for (var key in this.props.platforms) {
        var platform = this.props.platforms[key]
        availablePlatforms.push(<PlatformItem type={platform} key={platform}/>);
      }  
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
      return <CreateAndroidClient app={ this.getAppToEdit() }/>
    }
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_IOS].selected) {
      return <CreateIOSClient app={ this.getAppToEdit() }/>
    }
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_CORDOVA].selected) {
      return <CreateCordovaClient app={ this.getAppToEdit() }/>
    }
    if (this.props.apps.createClientAppDialog.platforms[PLATFORM_XAMARIN].selected) {
      return <CreateXamarinClient app={ this.getAppToEdit() } />
    }
  }

  renderModal() {
    return (
      <Modal show={this.state.showModal}>
        <Modal.Header>
        <button
          className="close"
          onClick={this.close}
          aria-hidden="true"
          aria-label="Close">
          <Icon type="pf" name="close" />
        </button>
          <Modal.Title>{ this.state.editingMode ? 'Edit Mobile App' : 'Create Mobile App' }</Modal.Title>
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
          <Button bsStyle="primary" onClick={this.createClient} disabled={!this.props.apps.createClientAppDialog.valid}>{ this.state.editingMode ? 'Save' : 'Create' }</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    return (
      <div>
        <Button bsStyle="primary" bsSize={this.props.createButtonSize} onClick={this.open}>
          Create Mobile App
        </Button>
        { this.renderModal() }
      </div>
    );
  }
}

export default ClientEditBaseClass;