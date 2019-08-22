import React, { Component } from 'react';
import { ListViewItem, Row, Col, DropdownKebab } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import DeleteItemButton from '../../containers/DeleteItemButton';
import BindingStatus from './BindingStatus';
import BindButton from './BindButton';

function configurationView(configuration) {
  if (configuration.type === 'href') {
    return (
      <a href={configuration.value} target="_blank" rel="noreferrer noopener">
        {configuration.value}
      </a>
    );
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

    let serviceDetailName = this.props.service.getId();
    const mdcDisplayName = _get(this.props.service, 'serviceInstance.metadata.data.labels.mdcName');
    if (mdcDisplayName) {
      serviceDetailName = mdcDisplayName;
    }

    const serviceDetailDescription = this.props.service.getDescription();
    return (
      <Col key={this.props.service.getId()} md={3} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
              <div>{serviceDetailName}</div>
              <div>
                <small>{serviceDetailDescription}</small>
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

    const docUrl = this.props.service.getDocumentationUrl();
    const serviceConfigurations = this.props.service.getConfiguration(this.props.appName);

    if (docUrl) {
      documentationFragment = (
        <Row>
          <Col md={2} className="detailsKey">
            Documentation:
          </Col>
          <Col md={10} className="detailsValue">
            <a href={docUrl} target="_blank" rel="noreferrer noopener">
              SDK Setup <i className="fa fa-external-link" aria-hidden="true" />
            </a>
          </Col>
        </Row>
      );
    }

    if (serviceConfigurations) {
      propertyFragment = serviceConfigurations.map(configuration => (
        <Row key={configuration.label}>
          <Col md={2} className="detailsKey">
            {configuration.label}:
          </Col>
          <Col md={10} className="detailsValue">
            {configurationView(configuration)}
          </Col>
        </Row>
      ));
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

  renderBindingStatus() {
    // check if the service is UPS.
    // binding status is not shown for other services in the BoundServiceRow view.
    // binding status is normally shown in UnboundServiceRow views.
    if (!this.props.service.isUPSService()) {
      return null;
    }

    return (
      <BindingStatus
        key={`${this.props.service.getId()}binding status`}
        service={this.props.service}
        onFinished={this.props.onFinished}
        appName={this.props.appName}
      />
    );
  }

  renderBindingButtons() {
    // check if the service is UPS. we only allow multiple bindings in case of UPS
    if (!this.props.service.isUPSService()) {
      return null;
    }

    if (this.props.service.getCustomResourcesForApp(this.props.appName).length >= 2) {
      return null;
    }

    return <BindButton service={this.props.service} onClick={this.props.onCreateBinding} />;
  }

  renderDeleteBindingDropdowns() {
    const crs = this.props.service.getCustomResourcesForApp(this.props.appName);

    return (
      <DropdownKebab id="delete-binding-id" pullRight>
        {crs.map(cr => (
          <DeleteItemButton
            key={`delete-cr-${cr.getName()}`}
            title={cr.getPlatform ? `Delete ${cr.getPlatform()}` : undefined}
            itemType="config"
            itemName={cr.getName()}
            onDelete={() => this.props.onDeleteBinding(cr)}
          />
        ))}
      </DropdownKebab>
    );
  }

  render() {
    return (
      <ListViewItem
        additionalInfo={[this.renderServiceBadge(), this.renderBindingStatus()]}
        className="boundService"
        actions={
          <div>
            {this.renderBindingButtons()}
            {this.renderDeleteBindingDropdowns()}
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
