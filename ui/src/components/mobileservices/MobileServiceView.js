import React, { Component } from 'react';
import BoundServiceRow from './BoundServiceRow';
import UnboundServiceRow from './UnboundServiceRow';
import DataService from '../../DataService';
import BindingPanel from "./BindingPanel";
import { createSecretName }  from '../bindingUtils';
import { connect } from 'react-redux';
import { fetchBindings } from '../../actions/serviceBinding';

class MobileServiceView extends Component {
  constructor(props) {
    super(props);
    this.createBindingCallback = this.createBindingCallback.bind(this)    
   

    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.showBindingDialog = this.showBindingDialog.bind(this);
  }

  componentDidMount() {
    this.props.fetchBindings(this.props.appName);
  }

  boundServiceRows() {
    const rows = [];
    if (this.props.boundServices) {
      rows.push(<h2 key="bound-services">Bound Services</h2>);
      this.props.boundServices.forEach((service) => {
        rows.push(<BoundServiceRow key={service.serviceId} service={service} />);
      });
    }

    return rows;
  }

  unboundServiceRows() {
    const rows = [];
    
    if (this.props.unboundServices) {
      rows.push(<h2 key="unbound-services">Unbound Services</h2>);
      this.props.unboundServices.forEach((service) => {
        rows.push(<UnboundServiceRow key={service.serviceId} service={service} showBindingDialog={this.showBindingDialog} />);
      });
    }
    return rows;
  }

  showBindingDialog(service) {
    this.bindingDialog.show(service);
  }

  createBindingCallback(serviceInstanceName, serviceClassExternalName, formData) {
    var credentialSecretName = createSecretName(serviceInstanceName + '-credentials-');
    var parametersSecretName = createSecretName(serviceInstanceName + '-bind-parameters-');
    
    DataService.createBinding(this.props.appName, serviceInstanceName, credentialSecretName, parametersSecretName, serviceClassExternalName, formData);
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


function mapStateToProps(state, ownProps) {
  if (state.serviceBindings.items && state.serviceBindings.items.length >= 1) {
    return {
      boundServices: state.serviceBindings.items[0].boundServices,
      unboundServices: state.serviceBindings.items[0].unboundServices
    };
  } else {
    return {
      boundServices: [],
      unboundServices: []
    };
  }
}

const mapDispatchToProps = {
  fetchBindings
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileServiceView);