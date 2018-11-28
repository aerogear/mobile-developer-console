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

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderServiceDetails = this.renderServiceDetails.bind(this);
  }

  renderServiceBadge() {
    let icon = <div />;
    if (this.props.service.getIconClass() != null && this.props.service.getIconClass().length > 0) {
      icon = <span className={`${this.props.service.getIconClass()} logo`} />;
    } else {
      icon = <img src={this.props.service.getLogoUrl()} alt="" />;
    }
    return (
      <Col key={this.props.service.getId()} md={3} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
              <div>{this.props.service.getName()}</div>
              <div>
                <small>{this.props.service.getId()}</small>
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

    if (this.props.service.getDocumentationUrl()) {
      documentationFragment = (
        <Row>
          <Col md={2} className="detailsKey">
            Documentation:
          </Col>
          <Col md={4} className="detailsValue">
            <a href={this.props.service.getDocumentationUrl()}>
              SDK Setup <i className="fa fa-external-link" aria-hidden="true" />
            </a>
          </Col>
        </Row>
      );
    }

    if (this.props.service.getConfiguration()) {
      propertyFragment = this.props.service.getConfiguration().map(configuration => {
        configuration = JSON.parse(configuration);

        return (
          <Row key={configuration.label}>
            <Col md={2} className="detailsKey">
              {configuration.label}:
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
            <DropdownKebab id={`delete-${this.props.service.getBindingName()}`} pullRight>
              <DeleteItemButton itemType="serviceBinding" itemName={this.props.service.getBindingName()} />
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
