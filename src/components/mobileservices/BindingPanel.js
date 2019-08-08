import { partition, get } from 'lodash-es';
import React, { Component } from 'react';
import { Wizard } from 'patternfly-react';
import { connect } from 'react-redux';
import Form from 'react-jsonschema-form';
import { createCustomResourceForService } from '../../actions/services';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';

import { FormValidator } from './validator/FormValidator';
import { MobileService } from '../../models/mobileservices/mobileservice';

export class BindingPanel extends Component {
  constructor(props) {
    super(props);

    this.onNextButtonClick = this.onNextButtonClick.bind(this);
    this.onBackButtonClick = this.onBackButtonClick.bind(this);
    this.renderPropertiesSchema = this.renderPropertiesSchema.bind(this);
    this.validate = this.validate.bind(this);
    this.onFormChange = this.onFormChange.bind(this);
    const serviceName = this.props.service.getName();
    const p = { appName: this.props.appName, service: this.props.service };
    const bindingFormConfig = this.props.service.getBindingForm(p);
    const { schema, uiSchema, validationRules, onChangeHandler } = bindingFormConfig;
    const { service } = this.props;

    this.state = {
      serviceName,
      schema,
      uiSchema,
      loading: false,
      service,
      activeStepIndex: 0,
      validationRules,
      onChangeHandler,
      key: Date.now() // required to reset any possible validation errors
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

  onFormChange(data) {
    const { formData } = data;
    if (this.state.onChangeHandler) {
      const newSchema = this.state.onChangeHandler(formData, this.state.schema);

      if (newSchema) {
        return this.setState({
          formData: {},
          schema: newSchema,
          key: Date.now() // reset any possible validation errors
        });
      }
    }
    return this.setState({ formData });
  }

  renderPropertiesSchema() {
    return (
      <Form
        key={this.state.key} // required to reset any possible validation errors
        schema={this.state.schema}
        uiSchema={this.state.uiSchema}
        ref={form => {
          this.form = form;
        }}
        validate={this.validate}
        showErrorList={false}
        formData={this.state.formData}
        onChange={this.onFormChange} // eslint-disable-line no-return-assign
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
                Bindings create a custom resource containing the necessary information for an application to use this
                service.
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
      this.props.createCustomResourceForService(this.state.service, this.state.formData, this.props.app).catch(() => {
        // go back one step as the custom resource failed to create
        this.setState({ loading: false, activeStepIndex: 1 });
      });
    }
  };

  /**
   * see https://github.com/mozilla-services/react-jsonschema-form/tree/6cb26d17c0206b610b130729db930d5906d3fdd3#form-data-validation
   */
  validate = (formData, errors) => {
    /* Very important facts : We only have 4 services right now and must manually validate the form data.  In Mobile core the angular form did a lot of this for free */
    const valid = new FormValidator(this.state.validationRules).validate(formData, (key, message) => {
      get(errors, key).addError(message);
    });

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
    const filteredServices = partition(this.props.services, service => service.isBound());
    return filteredServices[0];
  }

  getUnboundServices() {
    const filteredServices = partition(this.props.services, service => service.isBound());
    return filteredServices[1];
  }
}

const mapDispatchToProps = {
  createCustomResourceForService
};

function mapStateToProps(state, ownProps) {
  const { appName } = ownProps;
  return {
    app: state.apps.items.find(app => app.metadata.name === appName),
    services: state.services.items.map(service => new MobileService(service))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BindingPanel);
