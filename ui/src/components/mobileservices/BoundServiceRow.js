import React, { Component } from 'react';
import {
  ListViewItem, Row, Col, DropdownKebab, MenuItem,
} from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import DeleteItemButton from '../../containers/DeleteItemButton';

class BoundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.service = props.service;

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderServiceDetails = this.renderServiceDetails.bind(this);
    this.configurationView = this.configurationView.bind(this);
  }

  renderServiceBadge() {
    let icon = <div/>
    if (this.service.serviceIconClass != null && this.service.serviceIconClass.length > 0) {
      icon = <span className ={this.service.serviceIconClass + " logo"}/>
    } else {
      icon = <img src={this.service.serviceLogoUrl} alt="" />
    }
    return (
      <Col key={this.service.serviceId} md={3} className="service-sdk-info">
        <Col md={12}>
          {icon}
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
      propertyFragment = this.service.configuration.map(configuration => {
        
        configuration = JSON.parse(configuration)
        
        return <Row key={configuration.label}>
          <Col md={2} className="detailsKey">
            {configuration.label}
            {' '}
:
          </Col>
          <Col md={4} className="detailsValue">
            {this.configurationView(configuration)}
          </Col>
        </Row>
      });
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
        additionalInfo={[this.renderServiceBadge()]}
        className="boundService"
        actions={(
          <div>
            <DropdownKebab id={`delete-${this.service.serviceBindingName}`} pullRight>
              <DeleteItemButton itemType="serviceBinding" itemName={this.service.serviceBindingName} />
            </DropdownKebab>
          </div>
)}
        hideCloseIcon
      >
        {this.renderServiceDetails()}
      </ListViewItem>
    );
  }

  configurationView(configuration) {
    if (configuration.type === "href") {
      return <a href={configuration.value}>{configuration.value}</a>
    }
    else {
      return configuration.valuel;
    }
  }
}



export default BoundServiceRow;
