import React, { Component } from 'react';
import { Grid, Wizard, Button } from 'patternfly-react';
import { connect } from 'react-redux';
import { get as _get } from 'lodash-es';
import PlatformItem from '../components/create_client/PlatformItem';
import CreateAndroidClient from '../components/create_client/CreateAndroidClient';
import CreateCordovaClient from '../components/create_client/CreateCordovaClient';
import CreateIOSClient from '../components/create_client/CreateIOSClient';
import CreateXamarinClient from '../components/create_client/CreateXamarinClient';
import { ResultsLine } from '../components/create_client/ResultsLine';
import {
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PLATFORM_CORDOVA,
  PLATFORM_XAMARIN,
  CREATE_CLIENT_TYPE,
  CLIENT_CONFIGURATION,
  CREATE_CLIENT_APP_ID,
  CREATE_CLIENT_NAME,
  WIZARD_SELECT_PLATFORM,
  WIZARD_CREATION_RESULT,
  WIZARD_CONFIGURE_CLIENT,
} from '../components/create_client/Constants';
import { createApp } from '../actions/apps';
import '../components/create_client/create_client.css';

/**
 *  Component for the mobile client creation.
 */
class CreateClient extends Component {
  constructor(props) {
    super(props);
    this.baseState = this.state;
  }

  state = {
    showModal: false,
    loading: false,
    activeStepIndex: WIZARD_SELECT_PLATFORM,
  }

  componentDidUpdate() {
    if (this.state.loading && !this.props.apps.isCreating) {
      if (this.props.apps.createError) {
        this.setState({
          resultIcon: 'pficon-error-circle-o',
          resultText: 'Failed when creating mobile client.',
          resultDetails: this.props.apps.createError.message,
          loading: false,
          resetOnStart: true,
        });
      } else {
        this.setState({
          resultIcon: 'pficon-ok',
          resultText: 'Mobile client successfully created.',
          loading: false,
          resetOnStart: true,
        });
      }
    }
  }

    steps = () => [
      {
        title: 'Select mobile client platform',
        render: () => {
          const clientType = _get(this.state, `${CLIENT_CONFIGURATION}.${CREATE_CLIENT_TYPE}`);
          return (
            <div>
              <h2>Select mobile client platform</h2>
              <Grid bsClass="platform-items">
                <Grid.Row>
                  <Grid.Col sm={6} md={2}>
                    <PlatformItem title="Android App" id="platform-android" inclass="fa fa-android" itemSelected={this.selectPlatform} selected={clientType === PLATFORM_ANDROID} />
                  </Grid.Col>
                  <Grid.Col sm={6} md={2}>
                    <PlatformItem title="Cordova App" id="platform-cordova" itemSelected={this.selectPlatform} selected={clientType === PLATFORM_CORDOVA}>
                      <span><img src="../../img/cordova.png" alt="Cordova" /></span>
                    </PlatformItem>
                  </Grid.Col>
                  <Grid.Col sm={6} md={2}>
                    <PlatformItem title="iOS App" id="platform-ios" inclass="fa fa-apple" itemSelected={this.selectPlatform} selected={clientType === PLATFORM_IOS} />
                  </Grid.Col>
                  <Grid.Col sm={6} md={2}>
                    <PlatformItem title="Xamarin App" id="platform-xamarin" itemSelected={this.selectPlatform} selected={clientType === PLATFORM_XAMARIN}>
                      <span><img src="../../img/xamarin.svg" alt="Xamarin" /></span>
                    </PlatformItem>
                  </Grid.Col>
                </Grid.Row>
              </Grid>
            </div>
          );
        },
      }, {
        title: 'Mobile client parameters',
        render: this.renderClientSpecificForm,
      }, {
        title: 'Result',
        render: () => (
          <div>
            <ResultsLine
              iconClass={this.state.resultIcon}
              text={this.state.resultText}
              resultDetails={this.state.resultDetails}
            />
          </div>
        ),
      },

    ]

    selectPlatform = (state) => {
      let selectedPlatform = '';
      switch (state.id) {
        case 'platform-android': selectedPlatform = PLATFORM_ANDROID; break;
        case 'platform-ios': selectedPlatform = PLATFORM_IOS; break;
        case 'platform-cordova': selectedPlatform = PLATFORM_CORDOVA; break;
        case 'platform-xamarin': selectedPlatform = PLATFORM_XAMARIN; break;
        default: throw new Error(`unsupported platform ${state.id}`);
      }
      this.setState({ activeStepIndex: WIZARD_CONFIGURE_CLIENT, clientConfiguration: { [CREATE_CLIENT_TYPE]: selectedPlatform } });
    }

    close = () => {
      if (!this.state.loading) {
        this.setState({ showModal: false, loading: false });
      }
    }

    open = () => {
      if (this.state.resetOnStart) { // resets the state if it was already there
        delete (this.state.clientConfiguration);
        delete (this.state.resultDetails);
        this.setState({ activeStepIndex: WIZARD_SELECT_PLATFORM });
      }
      this.setState({ showModal: true, loading: false });
    };

    configureClient = (state) => {
      const newState = { clientConfiguration: state.clientConfiguration };
      newState.validated = state.validation && state.validation[CREATE_CLIENT_NAME] && state.validation[CREATE_CLIENT_APP_ID] && !Object.values(state.validation).find(v => v === 'error'); // check if everything was filled in and validated
      this.setState(newState);
    }

    renderClientSpecificForm = () => {
      switch (this.state.clientConfiguration[CREATE_CLIENT_TYPE]) {
        case PLATFORM_ANDROID:
          return <CreateAndroidClient configureClient={this.configureClient} clientConfiguration={this.state.clientConfiguration} />;
        case PLATFORM_CORDOVA:
          return <CreateCordovaClient configureClient={this.configureClient} clientConfiguration={this.state.clientConfiguration} />;
        case PLATFORM_IOS:
          return <CreateIOSClient configureClient={this.configureClient} clientConfiguration={this.state.clientConfiguration} />;
        case PLATFORM_XAMARIN:
          return <CreateXamarinClient configureClient={this.configureClient} clientConfiguration={this.state.clientConfiguration} />;
        default:
          return null;
      }
    }


    nextStep = () => {
      if (this.state.activeStepIndex < this.steps().length - 1) this.setState({ activeStepIndex: this.state.activeStepIndex + 1 });
    }

    backStep = () => {
      if (this.state.activeStepIndex > WIZARD_SELECT_PLATFORM && this.state.activeStepIndex < WIZARD_CREATION_RESULT) {
        this.setState({ activeStepIndex: this.state.activeStepIndex - 1 });
      }
    }

    nextStepDisabled = () => (this.state.activeStepIndex === WIZARD_SELECT_PLATFORM && this.state.platform === undefined) || (this.state.activeStepIndex === WIZARD_CONFIGURE_CLIENT && !this.state.validated)

    stepChanged = (step) => {
      if (step === WIZARD_CREATION_RESULT) {
        this.setState({ loading: true });
        this.callClientCreation();
      }
    }

    callClientCreation = () => {
      this.props.createApp(this.state.clientConfiguration);
    }


    render() {
      return (
        <div>
          <Button bsStyle="primary" bsSize="large" onClick={this.open}>
                    New mobile client
          </Button>
          <Wizard.Pattern
            show={this.state.showModal}
            onHide={this.close}
            onExited={this.close}
            title="Create mobile client"
            steps={this.steps()}
            loadingTitle="Creating mobile client..."
            loadingMessage="This may take a while."
            loading={this.state.loading}
            nextStepDisabled={this.nextStepDisabled()}
            onStepChanged={this.stepChanged}
            nextText={this.state.activeStepIndex === WIZARD_CONFIGURE_CLIENT ? 'Create' : 'Next'}
            onNext={this.nextStep}
            onBack={this.backStep}
            activeStepIndex={this.state.activeStepIndex}
          />

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
