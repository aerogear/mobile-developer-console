import React, { Component } from 'react';
import { Title, DataList } from '@patternfly/react-core';
import { EmptyState, Spinner } from 'patternfly-react';
import { connect } from 'react-redux';
import { partition } from 'lodash-es';

import BoundServiceRow from './BoundServiceRow';
import UnboundServiceRow from './UnboundServiceRow';
import './MobileServiceView.css';
import { fetchAndWatchServices, deleteCustomResource } from '../../actions/services';
import BindingPanel from './BindingPanel';
import { MobileService, MobileApp } from '../../models/';

export class MobileServiceView extends Component {
  constructor(props) {
    super(props);

    this.bindingPanelRef = React.createRef();

    this.state = {
      bindingPanelService: null
    };

    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.hideBindingPanel = this.hideBindingPanel.bind(this);
  }

  componentDidMount() {
    this.props.fetchAndWatchServices();
  }

  boundServiceRows() {
    // const removeBorders = ""
    return (
      <React.Fragment>
        {this.props.boundServices && this.props.boundServices.length > 0 ? (
          <Title key="bound-services" headingLevel="h4" size="2xl" className="pf-u-mb-lg">
            Bound Services
          </Title>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        <DataList style={{ borderTop: '0px', borderBottom: '0px' }}>
          {this.props.boundServices && this.props.boundServices.length > 0 ? (
            this.props.boundServices.map(service => (
              <React.Fragment>
                <BoundServiceRow
                  key={service.getId()}
                  appName={this.props.appName}
                  service={service}
                  onCreateBinding={() => this.showBindingPanel(service)}
                  onFinished={this.hideBindingPanel}
                  onDeleteBinding={cr => this.props.deleteCustomResource(service, cr.toJSON())}
                />
              </React.Fragment>
            ))
          ) : (
            <React.Fragment></React.Fragment>
          )}
        </DataList>
      </React.Fragment>
    );
  }

  unboundServiceRows() {
    return (
      <React.Fragment>
        <Title key="unbound-services" headingLevel="h4" size="2xl" className="pf-u-mt-md pf-u-mb-sm">
          Available Services
        </Title>
        <p className="pf-u-mb-lg">
          The services listed below are not configured for your mobile application yet. Select <q>Create a binding</q>
          to get started.
        </p>
        <DataList style={{ borderTop: '0px', borderBottom: '0px' }}>
          {this.props.unboundServices && this.props.unboundServices.length > 0 ? (
            this.props.unboundServices.map(service => (
              <UnboundServiceRow
                key={service.getId()}
                service={service}
                onCreateBinding={() => this.showBindingPanel(service)}
                onFinished={this.hideBindingPanel}
              />
            ))
          ) : (
            <EmptyState>There are no available services.</EmptyState>
          )}
        </DataList>
      </React.Fragment>
    );
  }

  shouldComponentUpdate() {
    return true;
  }

  showBindingPanel = service => {
    this.setState({
      bindingPanelService: service
    });
  };

  hideBindingPanel = force => {
    if (this.state.bindingPanelService && (force || this.bindingPanelRef.current.getWrappedInstance().isInProgress())) {
      this.setState({
        bindingPanelService: null
      });
    }
  };

  render() {
    const { isReading = true, boundServices, unboundServices } = this.props;
    return (
      <div className="mobile-service-view">
        <Spinner
          loading={isReading && boundServices.length === 0 && unboundServices.length === 0}
          className="spinner-padding"
        >
          {this.boundServiceRows()}
          {this.unboundServiceRows()}
        </Spinner>
        {this.state.bindingPanelService && (
          <BindingPanel
            ref={this.bindingPanelRef}
            appName={this.props.appName}
            service={this.state.bindingPanelService}
            showModal
            close={() => this.hideBindingPanel(true)}
          />
        )}
      </div>
    );
  }
}

function mapStateToProps(state, oldProp) {
  const app = MobileApp.find(state.apps.items, oldProp.appName);
  const services = state.services.items.map(item => new MobileService(item));
  const filteredServices = partition(services, service => service.isBoundToApp(oldProp.appName));
  return {
    ...state.services,
    app,
    boundServices: filteredServices[0],
    unboundServices: filteredServices[1]
  };
}

const mapDispatchToProps = {
  fetchAndWatchServices,
  deleteCustomResource
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileServiceView);
