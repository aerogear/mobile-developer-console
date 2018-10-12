
import React, { Component } from 'react';
import {
  Wizard
} from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import Form from "react-jsonschema-form";
import debounce from 'lodash/debounce';


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
    this.createBindingCallback = props.createBindingCallback;
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

  show(serviceName, schema, form) {
    this.setState({
      serviceName:serviceName,
      schema:schema,
      form:form,
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
          this.setState({ loading: true });
          this.createBindingCallback(this.formData);
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

//This renders the json fields using the rules from the form definition.
function OpenShiftObjectTemplate({ TitleField, uiSchema,schema, properties, title, description }) {
  const form = uiSchema.form

  return (
    <div>
    <TitleField title={title} />
    <div className="row">
      {form.map(key => (
        getOpenShiftField(key, properties)
      ))}
    </div>
    {description}
  </div>
  );
}

function getOpenShiftField(field, properties) {
  if (!field.items) {
    const property = properties.find(prop=>prop.name === field)
    return <div
              key={property.content.key}>
              {property.content}
            </div>
  } else {
    return getFieldSet(field, properties);
  }
}

function getFieldSet(field, properties) {
  const title = field.title;
  const items = field.items;

  const fieldSetItems = items.map(item => {
    if (typeof item === "string") {
      return properties.find(prop=>prop.name === item).content
    } else {
      return properties.find(prop=>prop.name === item.key).content
    }
  })

  return <fieldset>
    <h2>{title}</h2>
  {
    fieldSetItems
  }</fieldset>;
}

export default BindingPanel;