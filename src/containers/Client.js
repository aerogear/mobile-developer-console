import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  PageSection,
  PageSectionVariants,
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  Modal,
  Button,
  Title,
  Split,
  SplitItem,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownPosition,
  ClipboardCopy,
  ClipboardCopyVariant
} from '@patternfly/react-core';
import { connect } from 'react-redux';
import { CaretDownIcon } from '@patternfly/react-icons';
import Moment from 'react-moment';
import MobileServiceView from '../components/mobileservices/MobileServiceView';
import { fetchApp, fetchAndWatchApps, deleteApp } from '../actions/apps';
import { fetchAndWatchBuildConfigs } from '../actions/buildConfigs';
import { fetchAndWatchBuilds } from '../actions/builds';
import { MobileApp } from '../models';
import './Client.css';
import { fetchAndWatchServices } from '../actions/services';

export class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false
    };

    this.handleModalToggle = () => {
      this.setState(({ isEditModalOpen }) => ({
        isEditModalOpen: !isEditModalOpen
      }));
    };

    this.onToggle = isDropdownOpen => {
      this.setState({
        isDropdownOpen
      });
    };
    this.onSelect = () => {
      this.setState({
        isDropdownOpen: !this.state.isDropdownOpen
      });
    };
  }

  componentDidMount() {
    const appName = this.props.match.params.id;

    this.props.fetchApp(appName);
    this.props.fetchAndWatchApps();

    this.props.fetchAndWatchServices();
  }

  getMobileApp() {
    return MobileApp.find(this.props.apps.items, this.props.match.params.id) || new MobileApp();
  }

  toggleDeleteModal = () => {
    this.setState({ isDeleteModalOpen: !this.state.isDeleteModalOpen });
  };

  componentDidUpdate(prevProps) {
    if (this.props.buildConfigs !== prevProps.buildConfigs || this.props.builds !== prevProps.builds) {
      const mobileApp = this.getMobileApp();
      if (mobileApp.spec) {
        const configs = this.props.buildConfigs.items.filter(
          config => config.metadata.labels['mobile-client-id'] === mobileApp.getID()
        );

        configs.forEach(config => delete config.builds);

        this.props.builds.items.forEach(build => {
          const matchingConfig = configs.find(config => config.metadata.name === build.metadata.labels.buildconfig);
          if (matchingConfig) {
            matchingConfig.builds = matchingConfig.builds || [];
            matchingConfig.builds.push(build);
          }
        });
      }
    }
  }

  triggerDeletion = itemName => {
    const { onDelete } = this.props;
    if (onDelete && typeof onDelete === 'function') {
      onDelete();
    } else {
      this.props.deleteApp(itemName);
    }
    this.props.history.push('/overview');
  };

  render() {
    const mobileApp = this.getMobileApp();
    const appName = this.props.match.params.id;
    const cardValues = { width: '450px', height: '100%', boxShadow: 'unset' };
    const { creationTimestamp = null } = mobileApp.metadata.data;
    const { isDropdownOpen } = this.state;
    const dropdownItems = [
      <DropdownItem key="app" onClick={this.toggleDeleteModal}>
        Delete
      </DropdownItem>
    ];
    return mobileApp ? (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light} className="pf-u-pb-0">
          <Level>
            <LevelItem>
              <Breadcrumb>
                <BreadcrumbItem to="/overview">Mobile Apps</BreadcrumbItem>
                <BreadcrumbItem isActive>Review and Edit</BreadcrumbItem>
              </Breadcrumb>
            </LevelItem>
            <LevelItem>
              <Dropdown
                onSelect={this.onSelect}
                position={DropdownPosition.right}
                toggle={
                  <DropdownToggle onToggle={this.onToggle} iconComponent={CaretDownIcon}>
                    Actions
                  </DropdownToggle>
                }
                isOpen={isDropdownOpen}
                dropdownItems={dropdownItems}
              />
            </LevelItem>
          </Level>
        </PageSection>
        <PageSection variant={PageSectionVariants.light} style={{ flex: '0', borderBottom: '1px solid #e0e0e0' }}>
          <Title headingLevel="h2" size="3xl">
            {mobileApp.getName()}
            <span className="creation-timestamp pf-u-ml-md">
              Created <Moment fromNow>{creationTimestamp}</Moment>
            </span>
          </Title>
          <Modal
            width="50%"
            title="Confirm Delete"
            isOpen={this.state.isDeleteModalOpen}
            onClose={this.toggleDeleteModal}
            actions={[
              <Button key="confirm" variant="danger" onClick={() => this.triggerDeletion(appName)}>
                Delete
              </Button>,
              <Button key="cancel" variant="secondary" onClick={this.toggleDeleteModal}>
                Cancel
              </Button>
            ]}
          >
            <p>
              {`Are you sure you want to delete '`}
              <b>{appName}</b>
              {`'?`}
            </p>
            <p>
              {appName} and its data will no longer be available. <b>It cannot be undone.</b> Make sure this is
              something you really want to do!
            </p>
          </Modal>
        </PageSection>
        <Split className="mdc-breakpoint-split" style={{ display: 'flex', flex: '1' }}>
          <SplitItem isFilled style={{ display: 'flex', flexDirection: 'column' }}>
            <PageSection>
              <MobileServiceView appName={appName} />
            </PageSection>
          </SplitItem>
          <SplitItem>
            <Card style={cardValues}>
              <CardBody isFilled={false}>
                <Title headingLevel="h3" size="2xl">
                  Full Mobile Config
                </Title>
                <p className="pf-u-my-md">
                  JavaScript-based mobile apps can be configured for a variety of mobile platforms. Our JavaScript SDK
                  supports the following frameworks.
                </p>
                <div className="pf-grid">
                  <div>
                    <img src="/img/cordova.jpg" width="25" height="25" alt="React logo" />
                    <p>Cordova</p>
                  </div>
                  <div>
                    <img src="/img/react.jpg" width="25" height="25" alt="React logo" />
                    <p>React</p>
                  </div>
                  <div>
                    <img src="/img/ionic.jpg" width="25" height="25" alt="Ionic logo" />
                    <p>Ionic</p>
                  </div>
                  <div>
                    <img src="/img/angular.jpg" width="25" height="25" alt="Angular logo" />
                    <p>Angular</p>
                  </div>
                  <div>
                    <img src="/img/vue.jpg" width="25" height="25" alt="Vue logo" />
                    <p>Vue</p>
                  </div>
                </div>
              </CardBody>
              <CardBody>
                <Title headingLevel="h4" size="lg" className="pf-u-mb-md">
                  mobile-services.json
                </Title>
                <ClipboardCopy
                  isCode
                  isReadOnly
                  isExpanded
                  variant={ClipboardCopyVariant.expansion}
                  className="mobile-client-config"
                >
                  {JSON.stringify(mobileApp, null, 2)}
                </ClipboardCopy>
              </CardBody>
            </Card>
          </SplitItem>
        </Split>
      </React.Fragment>
    ) : (
      <React.Fragment />
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps,
    buildConfigs: state.buildConfigs,
    builds: state.builds
  };
}

const mapDispatchToProps = {
  fetchApp,
  fetchAndWatchBuildConfigs,
  fetchAndWatchBuilds,
  fetchAndWatchServices,
  fetchAndWatchApps,
  deleteApp
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Client)
);
