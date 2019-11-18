import React, { Component } from 'react';
import { DataListItem, DataListItemRow, DataListCell, DataListAction, DataListItemCells } from '@patternfly/react-core';
import { get as _get } from 'lodash-es';
import BindingStatus from './BindingStatus';
import BindButton from './BindButton';
import './ServiceRow.css';
import './MobileServiceView.css';

class UnboundServiceRow extends Component {
  constructor(props) {
    super(props);

    this.renderServiceBadge = this.renderServiceBadge.bind(this);
    this.renderBindingStatus = this.renderBindingStatus.bind(this);
  }

  renderServiceBadge() {
    let serviceDetailName = this.props.service.getId();
    const serviceDetailDescription = this.props.service.getDescription();
    const mdcDisplayName = _get(this.props.service, 'serviceInstance.metadata.data.labels.mdcName');
    if (mdcDisplayName) {
      serviceDetailName = mdcDisplayName;
    }

    let icon = <div />;
    if (this.props.service.getIconClass() != null && this.props.service.getIconClass().length > 0) {
      icon = <span className={`${this.props.service.getIconClass()} logo`} />;
    } else {
      icon = <img src={this.props.service.getLogoURLBlackAndWhite()} alt="" />;
    }
    return (
      <DataListItemCells
        dataListCells={[
          <DataListCell key={this.props.service.getId()} className="mdc-data-list-icon">
            {icon}
          </DataListCell>,
          <DataListCell key="primary content">
            <div id="ex-item1">{serviceDetailName}</div>
            <span>{serviceDetailDescription}</span>
          </DataListCell>
        ]}
      />
    );
  }

  renderBindingStatus() {
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
    return (
      <div>
        <BindButton appName={this.props.appName} service={this.props.service} onClick={this.props.onCreateBinding} />
      </div>
    );
  }

  render() {
    return (
      <DataListItem key={this.props.service.getId()} aria-labelledby="ex-item1">
        <DataListItemRow className="mdc-unbound-data-list-row">
          {this.renderServiceBadge()}
          <DataListAction aria-labelledby="ex-item1 ex-action1" id="ex-action1" aria-label="Actions">
            {this.renderBindingButtons()}
          </DataListAction>
        </DataListItemRow>
      </DataListItem>
    );
  }
}

export default UnboundServiceRow;
