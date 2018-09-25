import React, { Component } from 'react';
import { Alert, Button, Row, Col, DropdownKebab, MenuItem } from 'patternfly-react';

import MobileClientServiceChart from './MobileClientServiceChart';
import ComponentSectionLabel from '../common/ComponentSectionLabel';
import MobileClientConfig from '../common/MobileClientConfig';
import MobileClientBuildList from './MobileClientBuildList';
import MobileListViewItem from '../common/MobileListViewItem';

import './OverviewListItem.css';

const actions = () => (
  <DropdownKebab id="mobile-client-actions" pullRight>
    <MenuItem>Edit</MenuItem>
    <MenuItem>Delete</MenuItem>
  </DropdownKebab>
);

const headings = mobileClient => (
  <div className="pull-left text-left">
    <div className="detail">
      <span className="text-uppercase">{mobileClient.spec.clientType}</span>
    </div>
    <a href={`/mobileclient/${mobileClient.metadata.name}`} className="name">
      <span>{mobileClient.spec.name}</span>
    </a>
    <div className="detail">{mobileClient.spec.appIdentifier}</div>
  </div>
);

const canBindToClient = serviceInstance => {
  const { metadata = { annotations: {} } } = serviceInstance;
  return metadata.annotations['aerogear.org/mobile-client-enabled'] === 'true';
};

const getNumBoundAndUnboundServices = (mobileClient = {}, mobileServiceInstances = []) =>
  mobileServiceInstances.reduce(
    (result, serviceInstance) => {
      if (!canBindToClient(serviceInstance)) {
        return result;
      }

      hasBinding(mobileClient, serviceInstance) ? result.bound++ : result.unbound++;

      return result;
    },
    { bound: 0, unbound: 0 }
  );

const hasBinding = (mobileClient, serviceInstance) => {
  const { services } = mobileClient.status;
  return services && services.some(si => si.id === serviceInstance.metadata.name);
};

class MobileClientOverviewList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dismissed: false
    };
  }

  handleDismiss = () => {
    this.setState({ dismissed: true });
  };

  getClientOverview = () => {
    const { mobileClient, mobileServiceInstances, mobileClientBuilds } = this.props;
    const numBoundAndUnbound = getNumBoundAndUnboundServices(mobileClient, mobileServiceInstances);
    const { unbound } = numBoundAndUnbound;

    return (
      <React.Fragment>
        <Row>
          <Col md={12}>
            {unbound && !this.state.dismissed ? (
              <Alert type="info" onDismiss={this.handleDismiss}>
                {unbound} mobile services are not bound to this client. <a>Bind them to use with this client.</a>
              </Alert>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <ComponentSectionLabel>Mobile Services</ComponentSectionLabel>
            <MobileClientServiceChart data={numBoundAndUnbound} />
            <a>View All Mobile Services</a>
          </Col>
          <Col md={6}>
            <ComponentSectionLabel>Client Info</ComponentSectionLabel>
            <MobileClientConfig mobileClient={mobileClient} />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12}>
            <ComponentSectionLabel>Mobile Builds</ComponentSectionLabel>
            <MobileClientBuildList mobileClientBuilds={mobileClientBuilds} />
            <a>View All Mobile Builds</a>
          </Col>
        </Row>
      </React.Fragment>
    );
  };

  getEmptyState = () => (
    <React.Fragment>
      <Row>
        <Col md={12} className="empty-state text-center">
          <p>Add a mobile service to your project. Or connect to external service.</p>
          <Button bsStyle="primary">Browse Mobile Services</Button>
        </Col>
      </Row>
    </React.Fragment>
  );

  render = () => {
    const { mobileClient, mobileServiceInstances } = this.props;
    return (
      <MobileListViewItem
        className="overview-list-view-item"
        key={mobileClient.metadata.uid}
        actions={actions()}
        checkboxInput={false}
        heading={headings(mobileClient)}
        stacked={false}
        hideCloseIcon
      >
        {mobileServiceInstances.length ? this.getClientOverview() : this.getEmptyState()}
      </MobileListViewItem>
    );
  };
}

export default MobileClientOverviewList;
