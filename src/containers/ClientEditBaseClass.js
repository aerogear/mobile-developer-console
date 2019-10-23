/* eslint guard-for-in: 0 */
import React, { Component, Fragment } from 'react';
import { Alert } from 'patternfly-react';
import { Form, Modal, Button } from '@patternfly/react-core';
import CreateClient from '../components/create_client/CreateClient';
import '../components/create_client/create_client.css';
import { MobileApp } from '../models';

class ClientEditBaseClass extends Component {
  constructor(props, editingMode) {
    super(props);
    this.state = {
      isModalOpen: false,
      loading: false,
      editingMode
    };
    this.createClient = this.createClient.bind(this);
    this.handleModalToggle = () => {
      this.setState(({ isModalOpen }) => ({
        isModalOpen: !isModalOpen
      }));
    };
  }

  getMobileAppToEdit(newWindow) {
    const {
      createClientAppDialog: { app },
      item
    } = this.props;

    if (!newWindow && app) {
      return new MobileApp({
        ...app
      });
    }

    if (item) {
      return new MobileApp(JSON.parse(JSON.stringify(item)));
    }

    return new MobileApp();
  }

  open = async () => {
    const app = this.getMobileAppToEdit(true);
    this.props.editApp(app);

    this.setState({
      error: null,
      isModalOpen: true,
      loading: false
    });
  };

  createClient(e) {
    if (e) {
      e.preventDefault();
    }
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
        this.setState({ isModalOpen: false, loading: false });
      }
    }
  }

  close = () => {
    if (!this.state.loading) {
      this.setState({ isModalOpen: false, loading: false });
    }
  };

  renderModal() {
    const { isModalOpen } = this.state;
    return (
      <Modal
        isSmall
        title={this.state.editingMode ? 'Edit mobile app' : 'Create a mobile app'}
        isOpen={isModalOpen}
        onClose={this.handleModalToggle}
        actions={[
          <Button
            key="save"
            variant="primary"
            onClick={this.createClient}
            disabled={this.getMobileAppToEdit() && !this.getMobileAppToEdit().isValid()}
          >
            {this.state.editingMode ? 'Save' : 'Create'}
          </Button>,
          <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        {this.state.error && (
          <Alert key="123" type="error">
            {this.state.error}
          </Alert>
        )}
        <Form onSubmit={this.createClient}>
          <CreateClient editing={this.state.editingMode} />
        </Form>
        <div className="pf-u-mt-xl">
          <p>Create cross-platform mobile apps using JavaScript.</p>
          <p className="pf-u-pb-md">You can use the following JavaScript frameworks:</p>
          <div className="pf-grid">
            <div>
              <img src="/img/cordova.jpg" width="25" height="25" alt="React logo" />
              <p>Cordova</p>
            </div>
            <div>
              <img src="/img/react.jpg" width="25" height="25" alt="React logo" />
              <p>React</p>
            </div>
            <div>
              <img src="/img/ionic.jpg" width="25" height="25" alt="Ionic logo" />
              <p>Ionic</p>
            </div>
            <div>
              <img src="/img/angular.jpg" width="25" height="25" alt="Angular logo" />
              <p>Angular</p>
            </div>
            <div>
              <img src="/img/vue.jpg" width="25" height="25" alt="Vue logo" />
              <p>Vue</p>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <Fragment>
        <Button onClick={this.handleModalToggle}>Create a mobile app</Button>
        {this.renderModal()}
      </Fragment>
    );
  }
}

export default ClientEditBaseClass;
