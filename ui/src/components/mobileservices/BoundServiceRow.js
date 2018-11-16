import React, { Component } from 'react';
import { ListViewItem, Row, Col, DropdownKebab } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import DeleteItemButton from '../../containers/DeleteItemButton';

function configurationView(configuration) {
  if (configuration.type === 'href') {
    return <a href={configuration.value}>{configuration.value}</a>;
  }

  return configuration.value;
}

class BoundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.service = props.service;

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderServiceDetails = this.renderServiceDetails.bind(this);
  }

  renderServiceBadge() {
    let icon = <div />;
    if (this.service.getIconClass() != null && this.service.getIconClass().length > 0) {
      icon = <span className={`${this.service.getIconClass()} logo`} />;
    } else {
      icon = <img src={this.service.getLogoUrl()} alt="" />;
    }
    return (
      <Col key={this.service.getId()} md={3} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
              <div>{this.service.getName()}</div>
              <div>
                <small>{this.service.getId()}</small>
              </div>
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

  renderServiceDetails() {
    let documentationFragment;
    let propertyFragment;

    if (this.service.getDocumentationUrl()) {
      documentationFragment = (
        <Row>
          <Col md={2} className="detailsKey">
            Documentation :
          </Col>
          <Col md={4} className="detailsValue">
            <a href="{this.service.getDocumentationUrl()}">
              SDK Setup
              <i className="fa fa-external-link" aria-hidden="true" />
            </a>
          </Col>
        </Row>
      );
    }

    if (this.service.getConfiguration()) {
      propertyFragment = this.service.getConfiguration().map(configuration => {
        configuration = JSON.parse(configuration);

        return (
          <Row key={configuration.label}>
            <Col md={2} className="detailsKey">
              {configuration.label} :
            </Col>
            <Col md={4} className="detailsValue">
              {configurationView(configuration)}
            </Col>
          </Row>
        );
      });
    } else {
      propertyFragment = <div>No configuration data to show for this service.</div>;
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
        actions={
          <div>
            <DropdownKebab id={`delete-${this.service.getBindingName()}`} pullRight>
              <DeleteItemButton itemType="serviceBinding" itemName={this.service.getBindingName()} />
            </DropdownKebab>
          </div>
        }
        hideCloseIcon
      >
        {this.renderServiceDetails()}
      </ListViewItem>
    );
  }
}

export default BoundServiceRow;
