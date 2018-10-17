import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createApp } from '../actions/apps';

import {
  FormGroup,
  ControlLabel,
  Button, Modal, Alert, Icon
} from 'patternfly-react';
import PlatformItem from '../components/create_client/PlatformItem';
import PlatformItems from '../components/create_client/PlatformItems';
import '../components/create_client/create_client.css';
import {
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PLATFORM_CORDOVA,
  PLATFORM_XAMARIN,
  CREATE_CLIENT_TYPE,
} from '../components/create_client/Constants';
import CreateAndroidClient from '../components/create_client/CreateAndroidClient';
import CreateCordovaClient from '../components/create_client/CreateCordovaClient';
import CreateXamarinClient from '../components/create_client/CreateXamarinClient';
import CreateIOSClient from '../components/create_client/CreateIOSClient';

class CreateClient extends Component {
  constructor(props) {
    super(props);
    this.baseState = this.state;
    this.createClient = this.createClient.bind(this);
  }

  state = {
    showModal: false,
    loading: false, 
    valid: false
  };

  open = () => {
    this.setState({
      error: undefined,
      clientConfiguration: null,
      resultDetails: null,
      validated: false,
      showModal: true, 
      loading: false,
      selectedPlatform: null
    });
  };

  selectPlatform = (state) => {

    var newState = {...this.state, valid: false};

    switch (state.id) {
      case 'platform_android': newState.selectedPlatform = PLATFORM_ANDROID; break;
      case 'platform_ios': newState.selectedPlatform = PLATFORM_IOS; break;
      case 'platform_cordova': newState.selectedPlatform = PLATFORM_CORDOVA; break;
      case 'platform_xamarin': newState.selectedPlatform = PLATFORM_XAMARIN; break;
      default: throw new Error(`unsupported platform ${state.id}`);
    }

    this.setState(newState);
  }

  renderPlatformSelection() {
    return (
      <FormGroup>
        <ControlLabel className="required">
          Application Platform
        </ControlLabel>
        <PlatformItems itemSelected={this.selectPlatform} >
          <PlatformItem title="Android" id="platform_android" inclass="fa fa-android"/>
          <PlatformItem title="Cordova" id="platform_cordova">
            <span><img src="../../img/cordova.png" alt="Cordova" /></span>
          </PlatformItem>
          <PlatformItem title="iOS" id="platform_ios" inclass="fa fa-apple" />
          <PlatformItem title="Xamarin" id="platform_xamarin" >
            <span><img src="../../img/xamarin.svg" alt="Xamarin" /></span>
          </PlatformItem>
        </PlatformItems>
      </FormGroup>
    )
  }

  configureClient = (state) => {
    this.setState({...this.state, valid: state.valid, newApp: state.newApp});
  }


  renderPlatform() {
    switch (this.state.selectedPlatform) {
      case PLATFORM_ANDROID: return <CreateAndroidClient configureClient={this.configureClient} clientConfiguration={{ [CREATE_CLIENT_TYPE]: 'platform-android' }} />
      case PLATFORM_IOS: return <CreateIOSClient configureClient={this.configureClient} clientConfiguration={{ [CREATE_CLIENT_TYPE]: 'platform-ios' }} />
      case PLATFORM_CORDOVA: return <CreateCordovaClient configureClient={this.configureClient} clientConfiguration={{ [CREATE_CLIENT_TYPE]: 'platform-cordova' }} />
      case PLATFORM_XAMARIN: return <CreateXamarinClient configureClient={this.configureClient} clientConfiguration={{ [CREATE_CLIENT_TYPE]: 'platform-xamarin' }} />
      default: return null;
    }
  }

  createClient() {
    this.setState({ loading: true });
    this.props.createApp(this.state.newApp);
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

  renderError() {
    if (this.state.error) {
     return (<Alert key="123" type="error">{this.state.error}</Alert>)      
    } 
    return '';
  }

  render() {
    const { valid } = this.state;
  
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
            aria-label="Close"
          >
            <Icon type="pf" name="close" />
          </button>

            <Modal.Title>Create Mobile App</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.renderError()}
            <FormGroup key={this.state.selectedPlatform}>
              {this.renderPlatform()}
            </FormGroup>
            {this.renderPlatformSelection()}

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Cancel</Button>
            <Button bsStyle="primary" onClick={this.createClient} disabled={!valid} >Create</Button>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateClient);

//export default CreateClient;