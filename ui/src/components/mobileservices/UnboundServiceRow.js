import React, { Component } from 'react';
import { ListView, ListViewItem, Col, Button, Icon } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import BindingPanel from './BindingPanel';

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
    let icon = <div />;
    if (this.service.getIconClass() != null && this.service.getIconClass().length > 0) {
      icon = <span className={`${this.service.getIconClass()} logo`} />;
    } else {
      icon = <img src={this.service.getLogoUrl()} alt="" />;
    }
    return (
      <Col md={3} key={this.service.getId()} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
              <div>
                <a href={`#${this.service.getId()}`}>{this.service.getName()}</a>
              </div>
              <div>
                <small>{this.service.getId()}</small>
              </div>
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
            Operation Failed. Please Try Again Later.
          </React.Fragment>
        )}
      </ListView.InfoItem>
    );
  }

  renderBindingButtons() {
    if (this.service.isBindingOperationInProgress()) {
      return null;
    }
    return (
      <div>
        <Button onClick={() => this.setState({ showModal: true })}>Bind to App</Button>
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <ListViewItem
          additionalInfo={[this.renderServiceBadge(), this.renderBindingStatus()]}
          actions={this.renderBindingButtons()}
        />
        <BindingPanel
          service={this.service}
          showModal={this.state.showModal}
          close={() => {
            this.setState({ showModal: false });
          }}
        />
      </React.Fragment>
    );
  }
}

export default UnboundServiceRow;
