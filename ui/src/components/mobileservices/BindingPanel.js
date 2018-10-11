
import React, { Component } from 'react';
import {
  Wizard
} from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import Form from "react-jsonschema-form";

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

  show(serviceName, schema) {
    this.setState({
      serviceName:serviceName,
      schema:schema,
      loading:false,
      showModal: false,
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

          onChange={console.log("changed")}
          onSubmit={console.log("submitted")}
          onError={console.log("errors")} >
          <div/>
          </Form>

    }
  
    renderWizardSteps() {
      return [{title:"Binding",render:()=>{
        return  <form class="ng-pristine ng-valid">
                  <div class="form-group">
                    <label>
                      <h3>Create a binding for <strong class="ng-binding">{this.state.serviceName}</strong></h3>
                    </label>
                    <span class="help-block">Bindings create a secret containing the necessary information for an application to use this service.</span>
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
          this.setState({ loading: true });
          this.callClientCreation();
        }
      }
  
      callClientCreation = () => {
        console.log("Create Binding");
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
export default BindingPanel;