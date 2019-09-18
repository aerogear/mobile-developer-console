import React, { Component } from 'react';
import { withRouter } from "react-router";
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
  ClipboardCopyVariant,
} from '@patternfly/react-core';
import { connect } from 'react-redux';
import { PencilAltIcon, CaretDownIcon } from '@patternfly/react-icons';
import Moment from 'react-moment';
// import ConfigurationView from '../components/configuration/ConfigurationView';
import MobileServiceView from '../components/mobileservices/MobileServiceView';
import { fetchApp, fetchAndWatchApps } from '../actions/apps';
import { fetchAndWatchBuildConfigs } from '../actions/buildConfigs';
import { fetchAndWatchBuilds } from '../actions/builds';
import { MobileApp } from '../models';
import BuildConfigDialog from './BuildConfigDialog';
import './Client.css';
import { fetchAndWatchServices } from '../actions/services';
import { deleteApp } from '../actions/apps';

export class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
      isEditModalOpen: false,
      isDeleteModalOpen: false,
      value1: '',
      isBuildConfigDialogOpen: false
    };

    this.handleTextInputChange1 = value1 => {
      this.setState({ value1 });
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
    this.setState({isDeleteModalOpen: !this.state.isDeleteModalOpen})
  }

  handleBuildConfigDialog = () => {
    this.setState({isBuildConfigDialogOpen: !this.state.isBuildConfigDialogOpen})
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

        // this.setState({ buildConfigs: configs });
      }
    }
  }

  triggerDeletion = (itemName) => {
    const { onDelete } = this.props;
    if (onDelete && typeof onDelete === 'function') {
      onDelete();
    } else {
      this.props.deleteApp(itemName);
    }
    this.props.history.push('/overview')
  };

  render() {
    const mobileApp = this.getMobileApp();
    const appName = this.props.match.params.id;
    const cardValues = { width: '450px', height: '100%', boxShadow: 'unset' };
    const { creationTimestamp = null } = mobileApp.metadata.data;
    const { clientInfo } = { clientId: mobileApp.getName() };
    const { isDropdownOpen } = this.state;
    const { isEditModalOpen, isDeleteModalOpen, isBuildConfigDialogOpen } = this.state;
    const { value1 } = this.state; 
    const dropdownItems = [
      <React.Fragment>
        {mobileApp ? (
          <React.Fragment>
            <DropdownItem
              key="app"
              onClick={this.handleBuildConfigDialog}
              >
              New build config
            </DropdownItem>
          </React.Fragment>
<<<<<<< HEAD
          ) : (
            ''
        )}
      </React.Fragment>,
      <DropdownItem
        key="app"
        onClick={this.toggleDeleteModal}
        >
        Delete
=======
        ) : (
          ''
        )}
        <DeleteItemButton itemType="app" itemName={this.props.match.params.id} navigate="/" />
>>>>>>> patternfly4-updates
      </DropdownItem>
    ];
    return mobileApp ? (
      <React.Fragment>
<<<<<<< HEAD
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
              toggle={<DropdownToggle onToggle={this.onToggle} iconComponent={CaretDownIcon}>Actions</DropdownToggle>}
              isOpen={isDropdownOpen}
              dropdownItems={dropdownItems}
            />
          </LevelItem>
=======
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
                isOpen={isOpen}
                dropdownItems={dropdownItems}
              />
            </LevelItem>
>>>>>>> patternfly4-updates
          </Level>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} style={{ flex: '0', borderBottom: '1px solid #e0e0e0' }}>
        <Title headingLevel="h2" size="3xl">
          {mobileApp.getName()}
          <span className="creation-timestamp pf-u-ml-md">
            Created <Moment fromNow>{creationTimestamp}</Moment>
          </span>
        </Title>
      <BuildConfigDialog
        update={false}
        clientInfo={ clientInfo }
        show={isBuildConfigDialogOpen}
        onShowStateChanged={isShown => this.setState({ isBuildConfigDialogOpen: isShown })}
      />
      <Modal
        width={'50%'}
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
                JavaScript-based mobile apps can be configured for a variety of mobile platforms. 
                Our JavaScript SDK supports the following frameworks.
              </p>
              <div class="pf-grid">
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
<<<<<<< HEAD
              </div>
            </CardBody>
            <CardBody>
              <Title headingLevel="h4" size="lg" className="pf-u-mb-md">
                mobile-services.json
              </Title>
              <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion} className="mobile-client-config">               
                "client": "myapp",
                "namespace": "uxd-test-project",
                "services": []
            </ClipboardCopy>
            </CardBody>
          </Card>
        </SplitItem> 
      </Split>
    </ React.Fragment>
=======
              </CardBody>
              <CardBody>
                <Title headingLevel="h4" size="lg" className="pf-u-mb-md">
                  mobile-services.json
                </Title>
                <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion} className="mobile-client-config">
                  {JSON.stringify(mobileApp, null, 2)}
                </ClipboardCopy>
              </CardBody>
            </Card>
          </SplitItem>
        </Split>
        {/* <Grid fluid className="client-details">
        {this.props.apps.readingError ? (
          <Alert>{this.props.apps.readingError.message}</Alert>
        ) : (
          <TabContainer id="basic-tabs-pf" activeKey={selectedTab} onSelect={this.handleNavSelect}>
            <div>
              <Nav bsClass="nav nav-tabs nav-tabs-pf nav-tabs-pf-secondary">
                <NavItem eventKey={TAB_CONFIGURATION.key} href={`#${TAB_CONFIGURATION.hash}`}>
                  Configuration
                </NavItem>
                {this.props.buildTabEnabled ? (
                  <NavItem eventKey={TAB_BUILDS.key} href={`#${TAB_BUILDS.hash}`}>
                    Builds
                  </NavItem>
                ) : null}
                <NavItem eventKey={TAB_MOBILE_SERVICES.key} href={`#${TAB_MOBILE_SERVICES.hash}`}>
                  Mobile Services
                </NavItem>
              </Nav>
              <TabContent>
                <TabPane eventKey={TAB_CONFIGURATION.key}>
                  <ConfigurationView app={mobileApp} appName={appName} />
                </TabPane>
                <TabPane eventKey={TAB_MOBILE_SERVICES.key}>
                  {/* <MobileServiceView appName={appName} /> */}
        {/* </TabPane>
                {this.props.buildTabEnabled ? (
                  <TabPane eventKey={TAB_BUILDS.key}>
                    <MobileClientBuildOverviewList
                      appName={appName}
                      clientInfo={clientInfo}
                      buildConfigs={this.state.buildConfigs}
                    />
                  </TabPane>
                ) : null}
              </TabContent>
            </div>
          </TabContainer>
        )}
      </Grid> */}
      </React.Fragment>
>>>>>>> patternfly4-updates
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
  deleteApp,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Client));
