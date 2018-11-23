import React, { Component } from 'react';
import { Spinner } from 'patternfly-react';
import { connect } from 'react-redux';
import BoundServiceRow from './BoundServiceRow';
import UnboundServiceRow from './UnboundServiceRow';
import { fetchBindings } from '../../actions/serviceBinding';
<<<<<<< HEAD
import DataService from '../../DataService';
=======
import './MobileServiceView.css';
>>>>>>> UX: No bound/unbound services message

class MobileServiceView extends Component {
  constructor(props) {
    super(props);
    this.boundServiceRows = this.boundServiceRows.bind(this);
    this.unboundServiceRows = this.unboundServiceRows.bind(this);
    this.setDefaultBindingProperties = this.setDefaultBindingProperties.bind(this);
  }

  componentDidMount() {
    this.props.fetchBindings(this.props.appName);
    this.wsBindings = DataService.watchBindableServices(this.props.appName, () => {
      this.props.fetchBindings(this.props.appName);
    });
  }

  componentWillUnmount() {
    this.wsServices && this.wsServices.close();
  }

  boundServiceRows() {
    return (
      <React.Fragment>
        <h2 key="bound-services">Bound Services</h2>
        {this.props.boundServices && this.props.boundServices.length > 0 ? (
          this.props.boundServices.map(service => <BoundServiceRow key={service.getId()} service={service} />)
        ) : (
          <h3>There are no bound services.</h3>
        )}
      </React.Fragment>
    );
  }

  unboundServiceRows() {
    return (
      <React.Fragment>
        <h2 key="unbound-services">Unbound Services</h2>
        {this.props.unboundServices && this.props.unboundServices.length > 0 ? (
          this.props.unboundServices.map(service => <UnboundServiceRow key={service.getId()} service={service} />)
        ) : (
          <h3>There are no unbound services.</h3>
        )}
      </React.Fragment>
    );
  }

  shouldComponentUpdate() {
    return true;
  }

  // This makes the field in the binding form set to the mobile client name
  setDefaultBindingProperties(service) {
    service.setBindingSchemaDefaultValues('CLIENT_ID', this.props.appName);
  }

  render() {
    const { isReading = true } = this.props;
    return (
      <div className="mobile-service-view">
        <Spinner loading={isReading} className="spinner-padding">
          {this.boundServiceRows()}
          {this.unboundServiceRows()}
        </Spinner>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.serviceBindings;
}

const mapDispatchToProps = {
  fetchBindings
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileServiceView);
