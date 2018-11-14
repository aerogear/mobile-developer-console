import React, { Component } from 'react';
import { ListViewItem, Col, Button, Icon } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
<<<<<<< HEAD
import BindingPanel from './BindingPanel';
=======
import BindingPanel from "./BindingPanel";
import { ListView } from 'patternfly-react/dist/js/components/ListView';
>>>>>>>  💄show the progress of the bind/unbind operations

class UnboundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.service = props.service;
    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderBindingStatus = this.renderBindingStatus.bind(this);
  }

  renderServiceBadge() {
<<<<<<< HEAD
    let icon = <div />;
    if (this.service.serviceIconClass != null && this.service.serviceIconClass.length > 0) {
      icon = <span className={`${this.service.serviceIconClass} logo`} />;
    } else {
      icon = <img src={this.service.serviceLogoUrl} alt="" />;
=======
    let icon = <div/>;
    if (this.service.getIconClass() != null && this.service.getIconClass().length > 0) {
      icon = <span className={this.service.getIconClass() + " logo"}/>
    } else {
      icon = <img src={this.service.getLogoUrl()} alt="" />
>>>>>>>  ✨ add mobile service models
    }
    return (
      <Col md={3} key={this.service.getId()} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
<<<<<<< HEAD
              <div>
                <a href={`#${this.service.serviceId}`}>{this.service.serviceName}</a>
              </div>
              <div>
                <small>{this.service.serviceId}</small>
              </div>
=======
              <div><a href={`#${this.service.getId()}`}>{this.service.getName()}</a></div>
              <div><small>{this.service.getId()}</small></div>
>>>>>>>  ✨ add mobile service models
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

  renderBindingStatus() {
    return (
      <ListView.InfoItem key="bind-status">
        {this.service.isBindingOperationInProgress() && (
          <React.Fragment>
            <Icon name="spinner" spin size="lg" />
            {this.service.getBindingOperation()} In Progress
          </React.Fragment>
        )}
        {this.service.isBindingOperationFailed() && (
          <React.Fragment>
            <Icon type="pf" name="error-circle-o" />
            Operation Failed. Please Try Again.
          </React.Fragment>
        )}
      </ListView.InfoItem>
    );
  }

  renderBindingButtons() {
<<<<<<< HEAD
    return (
      <div>
        <Button onClick={() => this.setState({ showModal: true })}>Bind to App</Button>
      </div>
    );
=======
    if (this.service.isBindingOperationInProgress()) {
      return null;
    }
    return <div><Button onClick={()=>this.setState( { showModal:true })}>Bind to App</Button></div> ;
>>>>>>>  💄show the progress of the bind/unbind operations
  }

  render() {
    return (
      <React.Fragment>
<<<<<<< HEAD
        <ListViewItem additionalInfo={[this.renderServiceBadge()]} actions={this.renderBindingButtons()} />
        <BindingPanel
          service={this.service}
          showModal={this.state.showModal}
          close={() => {
            this.setState({ showModal: false });
          }}
=======
        <ListViewItem
          additionalInfo={[this.renderServiceBadge(), this.renderBindingStatus()]}
          actions={this.renderBindingButtons()}
>>>>>>>  💄show the progress of the bind/unbind operations
        />
      </React.Fragment>
    );
  }
}

export default UnboundServiceRow;
