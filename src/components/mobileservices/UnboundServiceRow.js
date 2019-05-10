import React, { Component } from 'react';
import { ListViewItem, Col } from 'patternfly-react';
import { get as _get } from 'lodash-es';
import BindingStatus from './BindingStatus';
import BindButton from './BindButton';
import '../configuration/ServiceSDKInfo.css';
import './ServiceRow.css';

class UnboundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderBindingStatus = this.renderBindingStatus.bind(this);
  }

  renderServiceBadge() {
    let serviceDetailName = this.props.service.getId();
    const mdcDisplayName = _get(this.props.service, 'serviceInstance.metadata.data.labels.mdcName');
    if (mdcDisplayName) {
      serviceDetailName = mdcDisplayName;
    }

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
                <small>{serviceDetailName}</small>
              </div>
            </h4>
          </div>
        </Col>
      </Col>
    );
  }

  renderBindingStatus() {
    return (
      <BindingStatus
        key={`${this.props.service.getId()}binding status`}
        service={this.props.service}
        onFinished={this.props.onFinished}
      />
    );
  }

  renderBindingButtons() {
    return (
      <div>
        <BindButton service={this.props.service} onClick={this.props.onCreateBinding} />
      </div>
    );
  }

  render() {
    return (
      <ListViewItem
        additionalInfo={[this.renderServiceBadge(), this.renderBindingStatus()]}
        className="unboundService"
        actions={this.renderBindingButtons()}
      />
    );
  }
}

export default UnboundServiceRow;
