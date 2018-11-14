import Form from 'react-jsonschema-form';
import debounce from 'lodash/debounce';
import React, { Component } from 'react';
import { Wizard } from 'patternfly-react';
import { connect } from 'react-redux';
import { createSecretName } from '../bindingUtils';
import { createBinding } from '../../actions/serviceBinding';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import { OpenShiftObjectTemplate } from './bindingPanelUtils';

class BindingPanel extends Component {
  constructor(props) {
    super(props);

    this.onNextButtonClick = this.onNextButtonClick.bind(this);
    this.onBackButtonClick = this.onBackButtonClick.bind(this);
    this.renderPropertiesSchema = this.renderPropertiesSchema.bind(this);
  }

  onNextButtonClick() {
    const { activeStepIndex } = this.state;
    this.setState({
      activeStepIndex: (activeStepIndex + 1) % 3
    });
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

  componentWillMount() {
    const { serviceName, bindingSchema: schema, form } = this.props.service;
    const { service } = this.props;

    this.setState({
      serviceName,
      schema,
      form,
      loading: false,
      service,
      activeStepIndex: 0
    });
  }

  renderPropertiesSchema() {
    return (
      <Form
        schema={this.state.schema}
        uiSchema={{ form: this.state.form }}
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
      const credentialSecretName = createSecretName(`${this.state.service.serviceInstanceName}-credentials-`);
      const parametersSecretName = createSecretName(`${this.state.service.serviceInstanceName}-bind-parameters-`);
      this.props.createBinding(
        this.props.appName,
        this.state.service.serviceInstanceName,
        credentialSecretName,
        parametersSecretName,
        this.state.service.serviceClassExternalName,
        this.formData
      );
    }
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
        loadingMessage="This may take a while."
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
