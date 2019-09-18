import Moment from 'react-moment';
import React from 'react';
import {
  Card,
  CardActions,
  CardHead,
  CardHeader,
  CardBody,
  CardFooter,
  Dropdown,
  DropdownToggle,
  Button,
  Modal,
  DropdownItem
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CloseIcon } from '@patternfly/react-icons';
import './MobileClientCardViewItem.css';
import { deleteApp } from '../../actions/apps';
import { deleteBuildConfig } from '../../actions/buildConfigs';

const getServiceIcons = services => {
  const icons = {
    metrics: <img alt="Metrics" className="icon" src="/img/metrics.svg" />,
    keycloak: <img alt="Keycloak" className="icon" src="/img/keycloak.svg" />,
    push: <img alt="Push" className="icon" src="/img/push.svg" />,
    sync: <img alt="Sync" className="icon" src="/img/sync.svg" />,
    'sync-app': <img alt="Sync" className="icon" src="/img/sync.svg" />,
    security: <img alt="Security" className="icon" src="/img/security.svg" />
  };
  return services.map((service, i) => (
    <span className="service-icon" key={i}>
      {icons[service.type]}
    </span>
  ));
};

class MobileClientCardViewItem extends React.Component {
  state = {
    isOpen: false,
    showModal: false
  };

  onToggle = isOpen => {
    this.setState({
      isOpen
    });
  };

  onSelect = event => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  triggerDeletion = itemName => {
    console.log('TRIGGERED', this.props);
    const { onDelete } = this.props;
    if (onDelete && typeof onDelete === 'function') {
      onDelete();
    } else {
      this.props.deleteApp(itemName);
    }
    this.handleDialogClose();
  };

  openDialog = () => {
    this.setState({
      showModal: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      showModal: false
    });
  };

  getItemName() {
    return this.props.item ? this.props.item.metadata.name : this.props.itemName;
  }

  render() {
    const { itemType, title = 'Delete' } = this.props;
    const itemName = this.getItemName();

    const {
      app,
      app: {
        metadata: { name: appName }
      },
      services,
      builds,
      buildTabEnabled
    } = this.props;
    return (
      <Card matchHeight className="mobile-client-card">
        <CardHead>
          <CardActions>
            <Dropdown
              id={appName}
              position="right"
              onSelect={this.onSelect}
              toggle={<DropdownToggle iconComponent={CloseIcon} onToggle={this.onToggle} />}
              isOpen={this.state.isOpen}
              isPlain
              dropdownItems={[
                <DropdownItem key="app" onClick={this.openDialog}>
                  {title}
                </DropdownItem>
              ]}
            />
            <Modal
              title="Confirm Delete"
              isOpen={this.state.showModal}
              onClose={this.handleDialogClose}
              actions={[
                <Button key="cancel" onClick={this.handleDialogClose}>
                  Cancel
                </Button>,
                <Button key="confirm" variant="danger" onClick={() => this.triggerDeletion(appName)}>
                  Delete
                </Button>
              ]}
            >
              <p>
                {`Are you sure you want to delete the ${itemType} '`}
                <b>{itemName}</b>
                {`'?`}
              </p>
              <p>
                {itemName} and its data will no longer be available. <b>It cannot be undone.</b> Make sure this is
                something you really want to do!
              </p>
            </Modal>
          </CardActions>
          <CardHeader>
            <Link to={`/mobileclient/${appName}`}>
              <b>{appName}</b>
            </Link>
          </CardHeader>
        </CardHead>
        <CardBody style={{ paddingTop: 0, paddingBottom: 0 }}>
          {services && services.length > 0 ? 'Bound Services' : ''}
          <div className="card-icons">
            {services && services.length > 0 ? getServiceIcons(services) : <div className="service-icon" />}
          </div>
        </CardBody>
        <Link to={`/mobileclient/${appName}`}>
          <CardFooter>
            <div className="creation-timestamp">
              Created
              <Moment format=" DD MMMM YYYY">{app.metadata.creationTimestamp}</Moment>
            </div>
            <span className="builds">
              {buildTabEnabled && builds.numFailedBuilds > 0 ? (
                <span>
                  <span className="pficon pficon-error-circle-o" />
                  {builds.numFailedBuilds}
                </span>
              ) : null}
              {buildTabEnabled && builds.numInProgressBuilds > 0 ? (
                <span>
                  <span className="pficon fa fa-refresh fa-spin fa-fw" />
                  {builds.numInProgressBuilds}
                </span>
              ) : null}
              {!buildTabEnabled || (builds.numFailedBuilds === 0 && builds.numInProgressBuilds === 0) ? <span /> : null}
            </span>
          </CardFooter>
        </Link>
      </Card>
    );
  }
}

const mapDispatchToProps = {
  deleteApp,
  deleteBuildConfig
};

export default connect(
  null,
  mapDispatchToProps
)(MobileClientCardViewItem);
