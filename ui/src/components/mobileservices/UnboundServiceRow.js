import React, { Component } from 'react';
import { ListViewItem, Col } from 'patternfly-react';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';
import BindingPanel from './BindingPanel';
import BindingStatus from './BindingStatus';
import BindButton from './BindButton';

class UnboundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    };

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderBindingStatus = this.renderBindingStatus.bind(this);
  }

  renderServiceBadge() {
    let icon = <div />;
    if (this.props.service.getIconClass() != null && this.props.service.getIconClass().length > 0) {
      icon = <span className={`${this.props.service.getIconClass()} logo`} />;
    } else {
      icon = <img src={this.props.service.getLogoUrl()} alt="" />;
    }
    return (
      <Col md={3} key={this.props.service.getId()} className="service-sdk-info">
        <Col md={12}>
          {icon}
          <div className="service-name">
            <h4>
              <div>
                <a href={`#${this.props.service.getId()}`}>{this.props.service.getName()}</a>
              </div>
              <div>
                <small>{this.props.service.getId()}</small>
              </div>
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

  renderBindingStatus() {
    return <BindingStatus key={`${this.props.service.getId()}binding status`} service={this.props.service} />;
  }

  renderBindingButtons() {
    return (
      <div>
        <BindButton service={this.props.service} onClick={() => this.setState({ showModal: true })} />
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        <ListViewItem
          additionalInfo={[this.renderServiceBadge(), this.renderBindingStatus()]}
          className="unboundService"
          actions={this.renderBindingButtons()}
        />
        <BindingPanel
          service={this.props.service}
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
