import { partition, find } from 'lodash-es';
import React, { Component } from 'react';
import { Wizard } from 'patternfly-react';
import { connect } from 'react-redux';
import Form from 'react-jsonschema-form';
import { createSecretName } from '../bindingUtils';
import { createBinding } from '../../actions/serviceBinding';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import { OpenShiftObjectTemplate } from './bindingPanelUtils';

import { FormValidator } from './validator/FormValidator';
import validationConfig from './ValidationRules.json';

export class BindingPanel extends Component {
  constructor(props) {
    super(props);

    this.onNextButtonClick = this.onNextButtonClick.bind(this);
    this.onBackButtonClick = this.onBackButtonClick.bind(this);
    this.renderPropertiesSchema = this.renderPropertiesSchema.bind(this);
    this.validate = this.validate.bind(this);
    const serviceName = this.props.service.getName();
    const schema = this.props.service.getBindingSchema();
    const form = this.props.service.getFormDefinition();
    const { service } = this.props;

    this.state = {
      serviceName,
      schema,
      form,
      loading: false,
      service,
      activeStepIndex: 0
    };
  }

  onNextButtonClick() {
    const { activeStepIndex } = this.state;
    if (activeStepIndex === 1) {
      this.form.submit();
      return false; // swallow the event, see validate function
    }
    this.setState({
      activeStepIndex: (activeStepIndex + 1) % 3
    });
    return true;
  }

  onBackButtonClick() {
    const { activeStepIndex } = this.state;
    this.setState({
      activeStepIndex: (activeStepIndex - 1) % 3
    });
  }

  show() {
    this.stepChanged(0);
    this.open();
  }

  hasUPSIOSBoundService() {
    return this.hasUPSBoundServiceForPlatform('ios');
  }

  hasUPSAndroidBoundService() {
    return this.hasUPSBoundServiceForPlatform('android');
  }

  hasUPSBoundServiceForPlatform(platform) {
    return find(
      this.getBoundServices(),
      service =>
        service.isUPSService() &&
        service.serviceBindings &&
        find(service.serviceBindings, serviceBinding => serviceBinding.getPlatform() === platform)
    );
  }

  renderPropertiesSchema() {
    return (
      <Form
        schema={this.state.schema}
        uiSchema={{ form: this.state.form }}
        ref={form => {
          this.form = form;
        }}
        validate={this.validate}
        showErrorList={false}
        ObjectFieldTemplate={OpenShiftObjectTemplate}
        onChange={e => (this.formData = e.formData)} // eslint-disable-line no-return-assign
      >
        <div />
      </Form>
    );
  }

  renderWizardSteps() {
    return [
      {
        title: 'Binding',
        render: () => (
          <form className="ng-pristine ng-valid">
            <div className="form-group">
              <label>
                <h3>
                  Create a binding for <strong className="ng-binding">{this.state.serviceName}</strong>
                </h3>
              </label>
              <span className="help-block">
                Bindings create a secret containing the necessary information for an application to use this service.
              </span>
            </div>
          </form>
        )
      },
      {
        title: 'Parameters',
        render: () => this.renderPropertiesSchema()
      },
      {
        title: 'Results',
        render: () => <div>review the binding</div>
      }
    ];
  }

  stepChanged = step => {
    if (step === 2) {
      this.setState({ loading: true });
      const credentialSecretName = createSecretName(`${this.state.service.getServiceInstanceName()}-credentials`);
      const parametersSecretName = createSecretName(`${this.state.service.getServiceInstanceName()}-bind-parameters`);
      this.props.createBinding(
        this.props.appName,
        this.state.service.getServiceInstanceName(),
        credentialSecretName,
        parametersSecretName,
        this.state.service.getServiceClassExternalName(),
        this.formData
      );
    }
  };

  /**
   * see https://github.com/mozilla-services/react-jsonschema-form/tree/6cb26d17c0206b610b130729db930d5906d3fdd3#form-data-validation
   */
  validate = (formData, errors) => {
    /* Very important facts : We only have 4 services right now and must manually validate the form data.  In Mobile core the angular form did a lot of this for free */

    const valid = new FormValidator(validationConfig).validate(
      { ...formData, SERVICE_TYPE: this.props.service.getServiceClassExternalName() },
      (key, message) => {
        errors[key].addError(message);
      }
    );

    if (valid) {
      // Avdance to final screen if valid
      this.setState({
        activeStepIndex: 2
      });
      this.stepChanged(2);
    }

    return errors;
  };

  filterPlatforms() {
    if (this.props.service.isUPSService()) {
      const hasIOS = this.hasUPSIOSBoundService();
      const hasAndroid = this.hasUPSAndroidBoundService();
      const { schema } = this.state;
      if (!hasAndroid && !hasIOS) {
        if (schema.properties.CLIENT_TYPE) {
          schema.properties.CLIENT_TYPE.default = 'Android';
          schema.properties.CLIENT_TYPE.enum = ['Android', 'IOS'];
        }
      } else if (hasAndroid && !hasIOS) {
        // UPS, there's already an Android variant
        if (schema.properties.CLIENT_TYPE) {
          schema.properties.CLIENT_TYPE.default = 'IOS';
          schema.properties.CLIENT_TYPE.enum = ['IOS'];
        }
      } else if (!hasAndroid && hasIOS) {
        // UPS, there's already an IOS variant
        if (schema.properties.CLIENT_TYPE) {
          schema.properties.CLIENT_TYPE.default = 'Android';
          schema.properties.CLIENT_TYPE.enum = ['Android'];
        }
      } else if (hasAndroid && hasIOS) {
        // UPS, there's already an IOS variant
        if (schema.properties.CLIENT_TYPE) {
          schema.properties.CLIENT_TYPE.default = '';
          schema.properties.CLIENT_TYPE.enum = [];
        }
      }
      // we don't care if there are variants for both platforms.
      // this binding panel shouldn't be shown anyway
    }
  }

  render() {
    this.filterPlatforms();
    return (
      <Wizard.Pattern
        onHide={this.props.close}
        onExited={this.props.close}
        show={this.props.showModal}
        title="Create a new service binding"
        steps={this.renderWizardSteps()}
        loadingTitle="Creating mobile binding..."
        loadingMessage="This may take a while. You can close this wizard."
        loading={this.state.loading}
        onStepChanged={this.stepChanged}
        nextText={this.state.activeStepIndex === 1 ? 'Create' : 'Next'}
        onNext={this.onNextButtonClick}
        onBack={this.onBackButtonClick}
        activeStepIndex={this.state.activeStepIndex}
      />
    );
  }

  getBoundServices() {
    const filteredServices = partition(this.props.serviceBindings.services, service => service.isBound());
    return filteredServices[0];
  }

  getUnboundServices() {
    const filteredServices = partition(this.props.serviceBindings.services, service => service.isBound());
    return filteredServices[1];
  }
}

const mapDispatchToProps = {
  createBinding
};

function mapStateToProps(state) {
  return {
    serviceBindings: state.serviceBindings
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BindingPanel);
