import { connect } from 'react-redux';
import React, { Component } from 'react';
import BoundServiceRow from './BoundServiceRow';
import UnboundServiceRow from './UnboundServiceRow';
import { fetchBindings } from '../../actions/serviceBinding';

class MobileServiceView extends Component {
  constructor(props) {
    super(props);
    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.setDefaultBindingProperties = this.setDefaultBindingProperties.bind(this);
  }

  componentDidMount() {
    this.props.fetchBindings(this.props.appName);
  }

  boundServiceRows() {
    const rows = [];
    if (this.props.boundServices) {
      rows.push(<h2 key="bound-services">Bound Services</h2>);
<<<<<<< HEAD
      this.props.boundServices.forEach(service => {
        rows.push(<BoundServiceRow key={service.serviceId} service={service} />);
=======
      this.props.boundServices.forEach((service) => {
        rows.push(<BoundServiceRow key={service.getId()} service={service} />);
>>>>>>>  ✨ add mobile service models
      });
    }

    return rows;
  }

  unboundServiceRows() {
    const rows = [];

    if (this.props.unboundServices) {
      rows.push(<h2 key="unbound-services">Unbound Services</h2>);
      this.props.unboundServices.forEach(service => {
        this.setDefaultBindingProperties(service);
        rows.push(<UnboundServiceRow key={service.getId()} service={service} />);
      });
    }
    return rows;
  }

  setDefaultBindingProperties(service) {
<<<<<<< HEAD
    try {
      if (service.bindingSchema.properties.CLIENT_ID) {
        service.bindingSchema.properties.CLIENT_ID.default = this.props.appName;
      }
    } catch {
      console.log(`Null reference setting default properties for ${service.serviceId}`);
    }
=======
    service.setBindingSchemaDefaultValues("CLIENT_ID", this.props.appName);
>>>>>>>  ✨ add mobile service models
  }

  render() {
    return (
      <div>
        {this.boundServiceRows()}
        {this.unboundServiceRows()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (state.serviceBindings.items && state.serviceBindings.items.length >= 1) {
    return {
      boundServices: state.serviceBindings.items[0].boundServices,
      unboundServices: state.serviceBindings.items[0].unboundServices
    };
  }
  return {
    boundServices: [],
    unboundServices: []
  };
}

const mapDispatchToProps = {
  fetchBindings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileServiceView);
