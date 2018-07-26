import React, { Component } from 'react';
import { Col } from 'patternfly-react';

class ServiceSDKInfo extends Component {
  render() {
    return (
      <Col md={6} style={{ padding: 0, marginBottom: 50 }}>
        <Col md={12}>
          <img
            src={this.props.serviceLogoUrl}
            style={{ width: 30, height: 30, display: 'inline-block', verticalAlign: 'middle' }}
            alt=""
          />
          <div style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 10 }}>
            <h4 style={{ margin: 0 }}>
              <div>{this.props.serviceName}</div>
              <div><small>{this.props.serviceId}</small></div>
            </h4>
          </div>
        </Col>
        <Col md={12}>
          <div style={{ paddingLeft: 40 }}>
            <h5>{this.props.serviceDescription}</h5>
            <h5><a href="#">{this.props.setupText}</a></h5>
          </div>
        </Col>
      </Col>
    );
  }
}

export default ServiceSDKInfo;
