
import React, { Component } from 'react';
import {
  Wizard
} from 'patternfly-react';
import { connect } from 'react-redux';
import { createSecretName }  from '../bindingUtils';
import { createBinding } from '../../actions/serviceBinding'
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import Form from "react-jsonschema-form";
import debounce from 'lodash/debounce';
import {OpenShiftObjectTemplate} from './bindingPanelUtils'

class BindingPanel extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
        showModal: false,
        activeStepIndex: 0,
        serviceName: props.serviceName
    };

    this.open = this.open.bind(this);
    this.show = this.show.bind(this);
    this.saveForm = this.saveForm.bind(this);
    this.onNextButtonClick = this.onNextButtonClick.bind(this);
    this.onBackButtonClick = this.onBackButtonClick.bind(this);
    this.renderPropertiesSchema = this.renderPropertiesSchema.bind(this);
  }

  open() {
    this.setState({ showModal: true });
  };

  close = () => {
    this.setState({ showModal: false });
  };

  onNextButtonClick() {
    
    const {  activeStepIndex } = this.state;
    this.setState({
      activeStepIndex: (activeStepIndex + 1) % 3
  })
}

onBackButtonClick() {
  
  const {  activeStepIndex } = this.state;
  this.setState({
    activeStepIndex: (activeStepIndex - 1) % 3
})
}

  show(service) {

    const serviceName = service.serviceName
    const schema = service.bindingSchema
    const form = service.form

    this.setState({
      serviceName:serviceName,
      schema:schema,
      serviceClassExternalName:service.serviceClassExternalName,
      form:form,
      loading:false,
      showModal: false,
      service:service,
      activeStepIndex: 0
    });
    this.stepChanged(0);
    this.open();
  }

  componentDidMount() {
    this.props.onRef(this)
}

  renderPropertiesSchema() {
    
          return <Form schema={this.state.schema}
          uiSchema={{form:this.state.form}}
          ObjectFieldTemplate={OpenShiftObjectTemplate}
          onChange={debounce(e => this.saveForm(e.formData), 150)} >
          <div/>
          </Form>

    }
  
    saveForm(formData) {
      this.formData = formData
    }

    renderWizardSteps() {
      return [{title:"Binding",render:()=>{
        return  <form className="ng-pristine ng-valid">
                  <div className="form-group">
                    <label>
                      <h3>Create a binding for <strong className="ng-binding">{this.state.serviceName}</strong></h3>
                    </label>
                    <span className="help-block">Bindings create a secret containing the necessary information for an application to use this service.</span>
                  </div>
                </form>
      }},
      { title:"Parameters",
        render: ()=>{return  this.renderPropertiesSchema()}
      },
      {title:"Results",render:()=>{
        return <div>review the binding</div>
      }},]
         
      }
  
      stepChanged = (step) => {
        if (step === 2) {
          console.log((this.state));
          this.setState({ loading: true });
          const credentialSecretName = createSecretName(this.state.service.serviceInstanceName + '-credentials-');
          const parametersSecretName = createSecretName(this.state.service.serviceInstanceName + '-bind-parameters-');
          this.props.createBinding(this.props.appName, this.state.service.serviceInstanceName, credentialSecretName, parametersSecretName, this.state.service.serviceClassExternalName, this.formData);
        }
      }
  

   render() {

       return <Wizard.Pattern
            show={this.state.showModal}
            onHide={this.close}
            onExited={this.close}
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
          />;
       
   }

}



const mapDispatchToProps = {
  createBinding
};

export default connect(null, mapDispatchToProps)(BindingPanel);
