import React, { Component } from 'react';
import { Wizard } from 'patternfly-react';
import { connect } from 'react-redux';
import Form from 'react-jsonschema-form';
import debounce from 'lodash/debounce';
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

    if (this.props.service.isUPSService()) {
      const hasUPSAndroidAnnotation = this.hasUPSAndroidAnnotation();
      const hasUPSIOSAnnotation = this.hasUPSIOSAnnotation();

      if (hasUPSAndroidAnnotation && !hasUPSIOSAnnotation) {
        // UPS, there's already an Android variant
        if (schema.properties.CLIENT_TYPE) {
          schema.properties.CLIENT_TYPE.default = 'IOS';
          schema.properties.CLIENT_TYPE.enum = ['IOS'];
        }
      } else if (!hasUPSAndroidAnnotation && hasUPSIOSAnnotation) {
        // UPS, there's already an IOS variant
        if (schema.properties.CLIENT_TYPE) {
          schema.properties.CLIENT_TYPE.default = 'Android';
          schema.properties.CLIENT_TYPE.enum = ['Android'];
        }
      }
      // we don't care if there are variants for both platforms.
      // this binding panel shouldn't be shown anyway
    }

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

  hasUPSAndroidAnnotation() {
    return this.hasUPSPlatformAnnotation('android');
  }

  hasUPSIOSAnnotation() {
    return this.hasUPSPlatformAnnotation('ios');
  }

  hasUPSPlatformAnnotation(platform) {
    // configExt field example value:
    // it is an array of annotations that start with org.aerogear.binding-ext
    // and our annotation's value is also an array
    /*
      [
        [
          {
            "type": "android",
            "typeLabel": "Android",
            "url": "https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/d6f4836a-11df-42d1-a442-e9cc823715a4",
            "id": "d6f4836a-11df-42d1-a442-e9cc823715a4"
          }
        ]
      ]
      */
    // there won't be any variant annotations if there is no binding yet
    if (!this.props.service.isBound()) {
      return false;
    }

    const configExt = this.props.service.getConfigurationExt();

    if (!configExt || !configExt.length) {
      return false;
    }

    for (const configItemStr of configExt) {
      let configExtItem;
      try {
        configExtItem = JSON.parse(configItemStr);
      } catch (err) {
        // not much we can do if the annotation is malformed
        return false;
      }
      if (configExtItem && configExtItem.length && configExtItem.length > 0) {
        for (const variantInfo of configExtItem) {
          if (variantInfo.type === platform) {
            return true;
          }
        }
      }
    }
    return false;
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
        onChange={debounce(e => (this.formData = e.formData), 150)} // eslint-disable-line no-return-assign
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
    const valid = new FormValidator(validationConfig)
      .withPostValidation(() => {
        if (formData.CLIENT_TYPE === 'IOS') {
          const confirmPasswordFieldId = `${this.form.state.idSchema.passphrase.$id}2`;
          const confirmPasswordField = document.getElementById(confirmPasswordFieldId);
          const passwordConfirmation = confirmPasswordField.value;
          if (formData.passphrase !== passwordConfirmation) {
            errors.iosIsProduction.addError('Passphrase does not match.');
            return true;
          }
        }
        return false;
      })
      .validate(formData, errors);

    if (valid) {
      // Avdance to final screen if valid
      this.setState({
        activeStepIndex: 2
      });
      this.stepChanged(2);
    }

    return errors;
  };

  render() {
    return (
      <Wizard.Pattern
        onHide={this.props.close}
        onExited={this.props.close}
        show={this.props.showModal}
        title="Create mobile client"
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
}

const mapDispatchToProps = {
  createBinding
};

export default connect(
  null,
  mapDispatchToProps
)(BindingPanel);
