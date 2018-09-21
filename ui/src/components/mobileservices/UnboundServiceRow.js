import React, { Component } from 'react';
import { ListViewItem, Col } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';

class UnboundServiceRow extends Component {

  constructor(props) {
    super(props);
        
    this.service = props.service;

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
        
  }    

  renderServiceBadge() {
    return (
      <Col md={3} className="service-sdk-info">
        <Col md={12}>
          <img src={this.service.serviceLogoUrl} alt="" />
          <div className="service-name">
            <h4>
              <div><a href={"#" + this.service.serviceId}>{this.service.serviceName}</a></div>
              <div><small>{this.service.serviceId}</small></div>
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

    

  render() {
        
    return (
      <ListViewItem 
        additionalInfo={this.renderServiceBadge()}
      >
      </ListViewItem>
    );
  }
}

export default UnboundServiceRow