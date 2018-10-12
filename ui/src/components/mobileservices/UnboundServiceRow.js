import React, { Component } from 'react';
import { ListViewItem, Col, Button } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';

class UnboundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.service = props.service;

    this.showBindingDialog = props.showBindingDialog;
    
    this.createBinding = this.createBinding.bind(this);
    this.renderServiceBadge = this.renderServiceBadge.bind(this);
  }

  renderServiceBadge() {
    let icon = <div/>;
    if (this.service.serviceIconClass != null && this.service.serviceIconClass.length > 0) {
      icon = <span className={this.service.serviceIconClass + " logo"}/>
    } else {
      icon = <img src={this.service.serviceLogoUrl} alt="" />
    }
    return (
      <Col md={3} key={this.service.serviceId} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
              <div><a href={`#${this.service.serviceId}`}>{this.service.serviceName}</a></div>
              <div><small>{this.service.serviceId}</small></div>
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

  createBinding() {
    
    this.showBindingDialog(this.service.serviceName, this.service.bindingSchema, this.service.form);
  }

  renderBindingButtons() {
    return <div><Button onClick={this.createBinding}>Create Binding</Button></div> ;
  }

  render() {
    
    return (
      <ListViewItem
        additionalInfo={[this.renderServiceBadge()]}
        actions={this.renderBindingButtons()}
      />
    );
  }
}

export default UnboundServiceRow;
