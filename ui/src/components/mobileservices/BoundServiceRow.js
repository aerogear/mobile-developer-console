import React, { Component } from 'react';
import {
  ListViewItem, Row, Col, DropdownKebab, MenuItem,
} from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';

class BoundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.service = props.service;

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderServiceDetails = this.renderServiceDetails.bind(this);
  }

  renderServiceBadge() {
    return (
      <Col md={3} className="service-sdk-info">
        <Col md={12}>
          <img src={this.service.serviceLogoUrl} alt="" />
          <div className="service-name">
            <h4>
              <div>{this.service.serviceName}</div>
              <div><small>{this.service.serviceId}</small></div>
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

  renderServiceDetails() {
    let documentationFragment;
    let propertyFragment;

    if (this.service.documentationUrl) {
      documentationFragment = (
        <Row>
          <Col md={2} className="detailsKey">
                    Documentation :
          </Col>
          <Col md={4} className="detailsValue">
            <a href="{this.service.documentationUrl}">
SDK Setup
              <i className="fa fa-external-link" aria-hidden="true" />
            </a>
          </Col>
        </Row>
      );
    }


    if (this.service.configuration) {
      propertyFragment = this.service.configuration.map(configuration => (
        <Row>
          <Col md={2} className="detailsKey">
            {configuration.key}
            {' '}
:
          </Col>
          <Col md={4} className="detailsValue">
            {configuration.value}
          </Col>
        </Row>
      ));
    } else {
      propertyFragment = (
        <div>No configuration data to show for this service.</div>
      );
    }

    return (
      <div>
        {documentationFragment}
        {propertyFragment}
      </div>
    );
  }

  render() {
    return (
      <ListViewItem
        additionalInfo={this.renderServiceBadge()}
        class="boundService"
        actions={(
          <div>
            <DropdownKebab id={`delete-${this.service.serviceId}`} pullRight>
              <MenuItem>Delete</MenuItem>
            </DropdownKebab>
          </div>
)}
        hideCloseIcon="true"
      >
        {this.renderServiceDetails()}
      </ListViewItem>
    );
  }
}

export default BoundServiceRow;
