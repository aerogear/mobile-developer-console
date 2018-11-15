/* eslint guard-for-in: 0 */
import React, { Component } from 'react';
import { FormGroup, Button, Modal, Alert, Icon } from 'patternfly-react';
import CreateClient from '../components/create_client/CreateClient';
import '../components/create_client/create_client.css';
import { MobileApp } from '../models';

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
          <FormGroup>
            <CreateClient editing={this.state.editingMode} />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.close}>Cancel</Button>
          <Button
            bsStyle="primary"
            onClick={this.createClient}
            disabled={this.getMobileAppToEdit() && !this.getMobileAppToEdit().isValid()}
          >
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
