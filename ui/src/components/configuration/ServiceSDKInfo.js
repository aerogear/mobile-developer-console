import React, { Component } from 'react';
import { Col } from 'patternfly-react';

import './ServiceSDKInfo.css';

class ServiceSDKInfo extends Component {
  render() {
    return (
      <Col md={6} className="service-sdk-info">
        <Col md={12}>
          <img src={this.props.serviceLogoUrl} alt="" />
          <div className="service-name">
            <h4>
              <div>{this.props.serviceName}</div>
              <div>
                <small>{this.props.serviceId}</small>
              </div>
            </h4>
          </div>
        </Col>
        <Col md={12}>
          <div className="service-details">
            <h5>{this.props.serviceDescription}</h5>
            <h5>
              <a>{this.props.setupText}</a>
            </h5>
          </div>
        </Col>
      </Col>
    );
  }
}

export default ServiceSDKInfo;
