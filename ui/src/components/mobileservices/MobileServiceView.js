import React, { Component } from 'react';
import BoundServiceRow from './BoundServiceRow';
import UnboundServiceRow from './UnboundServiceRow';
import DataService from '../../DataService';
import BindingPanel from "./BindingPanel";
import { createSecretName }  from '../bindingUtils';

class MobileServiceView extends Component {
  constructor(props) {
    super(props);
    this.appName = props.appName
    this.createBindingCallback = this.createBindingCallback.bind(this)    

    DataService.bindableServices().then(
      
      instances => {
            let unboundServices = [];
            let boundServices = [];
             instances.forEach ( instance => {
               
                let serviceName = instance.name;
                let serviceIcon = instance.imageUrl;
                let serviceIconClass = instance.iconClass;
                
                if (instance.isBound) {
                  
                  boundServices.push({
                    serviceLogoUrl: serviceIcon,
                    serviceIconClass: serviceIconClass,
                    serviceName: serviceName,
                    serviceInstanceName: instance.serviceInstance.metadata.name,
                    serviceId: serviceName,
                    serviceDescription: instance.serviceClass.spec.description,
                    documentationUrl: instance.serviceClass.spec.externalMetadata.documentationUrl20,
                    configuration: instance.configuration,
                    setupText: 'Identity Management SDK setup',            
                  });
                } else {
                  unboundServices.push({
                    serviceLogoUrl: serviceIcon,
                    serviceIconClass: serviceIconClass,
                    serviceName: serviceName,
                    serviceInstanceName: instance.serviceInstance.metadata.name,
                    serviceId: serviceName,
                    bindingSchema : instance.servicePlan.spec.serviceBindingCreateParameterSchema,
                    form : instance.servicePlan.spec.externalMetadata.schemas.service_binding.create.openshift_form_definition,
                    serviceDescription: instance.serviceClass.spec.description,
                    setupText: 'Mobile Metrics SDK setups',
                  });
                }
                
                this.state.boundServices = boundServices;
                this.state.unboundServices = unboundServices;
                this.setState(this.state);
            })
          }
        );
      
    this.state = {
      boundServices: [],
      unboundServices: [],
    };

    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.showBindingDialog = this.showBindingDialog.bind(this);
  }

  boundServiceRows() {
    const rows = [];
    if (this.state.boundServices) {
      rows.push(<h2 key="bound-services">Bound Services</h2>);
      this.state.boundServices.forEach((service) => {
        rows.push(<BoundServiceRow key={service.serviceId} service={service} />);
      });
    }

    return rows;
  }

  unboundServiceRows() {
    const rows = [];
    
    if (this.state.unboundServices) {
      rows.push(<h2 key="unbound-services">Unbound Services</h2>);
      this.state.unboundServices.forEach((service) => {
        rows.push(<UnboundServiceRow key={service.serviceId} service={service} showBindingDialog={this.showBindingDialog} />);
      });
    }
    return rows;
  }

  showBindingDialog(service) {
    this.bindingDialog.show(service);
  }

  createBindingCallback(serviceInstanceName, formData) {
    var credentialSecretName = createSecretName(serviceInstanceName + '-credentials-');
    var parametersSecretName = createSecretName(serviceInstanceName + '-bind-parameters-');
    DataService.createBinding(serviceInstanceName, credentialSecretName, parametersSecretName, formData);
  }

  render() {
    return (
      <div>
        {this.boundServiceRows()}
        {this.unboundServiceRows()}
        <BindingPanel onRef= {(dialog)=>{this.bindingDialog = dialog; }} createBindingCallback={this.createBindingCallback}/>
      </div>
    );
  }
}

export default MobileServiceView;

