import React, { Component } from 'react';
import { ListView, ListViewItem, Row, Col, Button, Icon, DropdownKebab } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import DeleteItemButton from '../../containers/DeleteItemButton';
import BindingPanel from './BindingPanel';

function configurationView(configuration) {
  if (configuration.type === 'href') {
    return <a href={configuration.value}>{configuration.value}</a>;
  }

  return configuration.value;
}

class BoundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
        showModal: false
    };

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

  renderBindingStatus() {
    // check if the service is UPS.
    // binding status is not shown for other services in the BoundServiceRow view.
    // binding status is normally shown in UnboundServiceRow views.
    if(!this.isUPSService()) {
        return null;
    }

    return (
        <ListView.InfoItem key="bind-status">
            {this.props.service.isBindingOperationInProgress() && (
                <React.Fragment>
                    <Icon name="spinner" spin size="lg" />
                    {this.props.service.getBindingOperation()} In Progress
                </React.Fragment>
            )}
            {this.props.service.isBindingOperationFailed() && (
                <React.Fragment>
                    <Icon type="pf" name="error-circle-o" />
                    Operation Failed. Please Try Again Later.
                </React.Fragment>
            )}
        </ListView.InfoItem>
    );
  }

  renderBindingButtons() {
    // check if the service is UPS. we only allow multiple bindings in case of UPS
    if(!this.isUPSService()) {
        return null;
    }
    if (this.props.service.isBindingOperationInProgress()) {
      return null;
    }
    const configurationExt = this.props.service.getConfigurationExt();
    // sample value for configurationExt
    /*
      "[
        {"type":"ios","typeLabel":"iOS","url":"https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/c8d70b96-bd52-499c-845b-756089e06d36","id":"c8d70b96-bd52-499c-845b-756089e06d36"},
        {"type":"android","typeLabel":"Android","url":"https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/2d76d1eb-65ef-471c-8d21-75f80c3f370f","id":"2d76d1eb-65ef-471c-8d21-75f80c3f370f"}
      ]"
    */
    if(configurationExt){
      const configExtArray = JSON.parse(configurationExt);
      // there are 2 variants already. can't create another variant.
      if (configExtArray && configExtArray.length && configExtArray.length >= 2) {
        return null;
      }
    }
    return (
      <Button className="bind-button" onClick={() => this.setState({ showModal: true })}>Bind to App</Button>
    );
  }

  isUPSService(){
    return this.props.service.serviceClass &&
          this.props.service.serviceClass.spec &&
          this.props.service.serviceClass.spec.data &&
          this.props.service.serviceClass.spec.data.externalName === "ag-unifiedpush-apb";
  }

  render() {
    return (
      <React.Fragment>
      <ListViewItem
        additionalInfo={[this.renderServiceBadge(), this.renderBindingStatus()]}
        className="boundService"
        actions={
          <div>
            {this.renderBindingButtons()}
            <DropdownKebab id={`delete-${this.props.service.getBindingName()}`} pullRight>
              <DeleteItemButton itemType="serviceBinding" itemName={this.props.service.getBindingName()} />
            </DropdownKebab>
          </div>
        }
        hideCloseIcon
      >
        {this.renderServiceDetails()}
      </ListViewItem>
          {this.isUPSService() &&
            <BindingPanel
                service={this.props.service}
                showModal={this.state.showModal}
                close={() => {
                    this.setState({ showModal: false });
                }}
            />
          }
    </React.Fragment>
    );
  }
}

export default BoundServiceRow;
