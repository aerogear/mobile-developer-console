import React, { Component } from 'react';
import { EmptyState, Spinner } from 'patternfly-react';
import { connect } from 'react-redux';
import { partition } from 'lodash-es';
import BoundServiceRow from './BoundServiceRow';
import UnboundServiceRow from './UnboundServiceRow';
import './MobileServiceView.css';
import { fetchServices } from '../../actions/services';
import BindingPanel from './BindingPanel';
import { MobileService } from '../../models/';

class MobileServiceView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bindingPanelService: null
    };

    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.addDefaultBindingProperty = this.addDefaultBindingProperty.bind(this);
    this.hideBindingPanel = this.hideBindingPanel.bind(this);
  }

  componentDidMount() {
    const { appName } = this.props;
    this.props.fetchServices(appName);
  }

  boundServiceRows() {
    return (
      <React.Fragment>
        <h2 key="bound-services">Bound Services</h2>
        {this.props.boundServices && this.props.boundServices.length > 0 ? (
          this.props.boundServices.map(service => {
            this.addDefaultBindingProperty(service);
            return (
              <BoundServiceRow
                key={service.getId()}
                service={service}
                onCreateBinding={() => this.showBindingPanel(service)}
                onFinished={this.hideBindingPanel}
              />
            );
          })
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
          this.props.unboundServices.map(service => {
            this.addDefaultBindingProperty(service);
            return (
              <UnboundServiceRow
                key={service.getId()}
                service={service}
                onCreateBinding={() => this.showBindingPanel(service)}
                onFinished={this.hideBindingPanel}
              />
            );
          })
        ) : (
          <EmptyState>There are no unbound services.</EmptyState>
        )}
      </React.Fragment>
    );
  }

  shouldComponentUpdate() {
    return true;
  }

  // This makes the field in the binding form set to the mobile client name
  addDefaultBindingProperty(service) {
    service.setBindingSchemaDefaultValues('CLIENT_ID', this.props.appName);
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
          <BindingPanel service={this.state.bindingPanelService} showModal close={this.hideBindingPanel} />
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const services = state.services.items.map(item => new MobileService(item));
  const filteredServices = partition(services, service => service.isBound());
  return { ...state.services, boundServices: filteredServices[0], unboundServices: filteredServices[1] };
}

const mapDispatchToProps = {
  fetchServices
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileServiceView);
