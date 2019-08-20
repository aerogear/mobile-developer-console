import React, { Component } from 'react';
import {
  Title
} from '@patternfly/react-core';
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

    this.state = {
      bindingPanelService: null,
      expanded: [],
      isOpen1: false,
      isOpen2: false,
      isOpen3: false
    };

    this.onToggle1 = isOpen1 => {
      this.setState({ isOpen1 });
    };

    this.onSelect1 = event => {
      this.setState(prevState => ({
        isOpen1: !prevState.isOpen1
      }));
    };

    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.hideBindingPanel = this.hideBindingPanel.bind(this);
  }

  componentDidMount() {
    this.props.fetchAndWatchServices();
  }

  boundServiceRows() {
    const toggle = id => {
      const expanded = this.state.expanded;
      const index = expanded.indexOf(id);
      const newExpanded =
        index >= 0 ? [...expanded.slice(0, index), ...expanded.slice(index + 1, expanded.length)] : [...expanded, id];
      this.setState(() => ({ expanded: newExpanded }));
    };
    return (
      <React.Fragment>
        <Title key="bound-services" headingLevel="h4" size="xl">
          Bound Services
        </Title>
        {this.props.boundServices && this.props.boundServices.length > 0 ? (
          this.props.boundServices.map(service => (
            <BoundServiceRow
              key={service.getId()}
              appName={this.props.appName}
              service={service}
              onCreateBinding={() => this.showBindingPanel(service)}
              onFinished={this.hideBindingPanel}
              onDeleteBinding={cr => this.props.deleteCustomResource(service, cr.toJSON())}
            />
          ))
        ) : (
          <EmptyState>There are no bound services.</EmptyState>
        )}
      </React.Fragment>
    );
  }

  unboundServiceRows() {
    return (
      <React.Fragment>
        <h2 key="unbound-services">Unbound Services</h2>
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
          <EmptyState>There are no unbound services.</EmptyState>
        )}
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

  hideBindingPanel = () => {
    if (this.state.bindingPanelService) {
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
            appName={this.props.appName}
            service={this.state.bindingPanelService}
            showModal
            close={this.hideBindingPanel}
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
  return { ...state.services, app, boundServices: filteredServices[0], unboundServices: filteredServices[1] };
}

const mapDispatchToProps = {
  fetchAndWatchServices,
  deleteCustomResource
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileServiceView);
