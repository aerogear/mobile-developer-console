import React, { Component } from 'react';
import {
  Nav,
  NavItem,
  TabContent,
  TabPane,
  TabContainer,
  DropdownButton,
  Alert,
  MenuItem
} from 'patternfly-react';
import {
  PageSection,
  PageSectionVariants,
  Breadcrumb,
  BreadcrumbItem,
  Level,
  LevelItem,
  Title,
  Split, 
  SplitItem,
  Card,
  CardBody,
  Button,
  Dropdown,
  Modal,
  Form,
  FormGroup,
  TextInput,
  DropdownToggle,
  DropdownItem,
  DropdownPosition,
  ClipboardCopy,
  ClipboardCopyVariant
} from '@patternfly/react-core';
import { connect } from 'react-redux';
import { PencilAltIcon } from '@patternfly/react-icons';
import { find } from 'lodash-es';
import Moment from 'react-moment';
import ConfigurationView from '../components/configuration/ConfigurationView';
import MobileServiceView from '../components/mobileservices/MobileServiceView';
import { fetchApp, fetchAndWatchApps } from '../actions/apps';
import { fetchAndWatchBuildConfigs } from '../actions/buildConfigs';
import { fetchAndWatchBuilds } from '../actions/builds';
import DeleteItemButton from './DeleteItemButton';
import { MobileApp } from '../models';
import { MobileClientBuildOverviewList } from '../components/build/MobileClientBuildOverviewList';
import BuildConfigDialog from './BuildConfigDialog';
import './Client.css';
import { fetchAndWatchServices } from '../actions/services';
import { CaretDownIcon } from '@patternfly/react-icons';

export const TAB_CONFIGURATION = { key: 1, hash: 'configuration' };
export const TAB_MOBILE_SERVICES = { key: 2, hash: 'services' };
export const TAB_BUILDS = { key: 3, hash: 'builds' };

const TABS = [TAB_CONFIGURATION, TAB_MOBILE_SERVICES, TAB_BUILDS];

export class Client extends Component {
  constructor(props) {
    super(props);
    let initialTab = find(TABS, { hash: props.location.hash.substring(1) });
    if (!initialTab) {
      initialTab = TAB_CONFIGURATION;
    }

    this.state = {
      buildConfigs: [],
      selectedTab: initialTab.key,
      isOpen: false,
      isModalOpen: false,
      value1: ''
    };

    this.handleTextInputChange1 = value1 => {
      this.setState({ value1 });
    };


    this.handleModalToggle = () => {
      this.setState(({ isModalOpen }) => ({
        isModalOpen: !isModalOpen
      }));
    };

    this.onToggle = isOpen => {
      this.setState({
        isOpen
      });
    };
    this.onSelect = event => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    };
    this.handleNavSelect = this.handleNavSelect.bind(this);
  }

  componentDidMount() {
    const appName = this.props.match.params.id;

    this.props.fetchApp(appName);
    this.props.fetchAndWatchApps();

    if (this.props.buildTabEnabled) {
      this.props.fetchAndWatchBuilds();
      this.props.fetchAndWatchBuildConfigs();
    }

    this.props.fetchAndWatchServices();
  }

  getMobileApp() {
    return MobileApp.find(this.props.apps.items, this.props.match.params.id) || new MobileApp();
  }

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

        this.setState({ buildConfigs: configs });
      }
    }
  }

  handleNavSelect = eventKey => {
    const { selectedTab } = this.state;
    if (selectedTab !== eventKey) {
      this.setState({ selectedTab: eventKey });
    }
  };

  // header = mobileApp => {
  //   // const { selectedTab, showBuildConfigDialog = false } = this.state;
  //   // const { creationTimestamp = null } = mobileApp.metadata.data;
  //   // passing empty string to build config dialog for now as the client id.
  //   return (
  //     <div className="app-header-wrapper">
  //       <div className="app-header">
  //         <div>
  //           <h1>
  //             {mobileApp.getName()}
  //             {/* <span className="creation-timestamp">
  //               created <Moment fromNow>{creationTimestamp}</Moment>
  //             </span> */}
  //           </h1>
  //         </div>
  //       </div>
  //       {/* <div className="app-actions-dropdown">
  //         <DropdownButton id="app-actions-dropdown" title="Actions" pullRight>
  //           {mobileApp && selectedTab === TAB_BUILDS.key ? (
  //             <React.Fragment>
  //               <MenuItem onClick={() => this.setState({ showBuildConfigDialog: true })}>New build config</MenuItem>
  //               <BuildConfigDialog
  //                 update={false}
  //                 clientInfo={{ clientId: mobileApp.getName() }}
  //                 show={showBuildConfigDialog}
  //                 onShowStateChanged={isShown => this.setState({ showBuildConfigDialog: isShown })}
  //               />
  //             </React.Fragment>
  //           ) : (
  //             ''
  //           )}
  //           <DeleteItemButton itemType="app" itemName={this.props.match.params.id} navigate="/" />
  //         </DropdownButton>
  //       </div> */}
  //     </div>
  //   );
  // };

  render() {
    const mobileApp = this.getMobileApp();
    const { selectedTab, showBuildConfigDialog = false } = this.state;
    const clientInfo = { clientId: mobileApp.getName() };
    // const { selectedTab } = this.state;
    const appName = this.props.match.params.id;
    const cardValues = { width: '450px', height: '100%', boxShadow: 'unset' };
    const { creationTimestamp = null } = mobileApp.metadata.data;
    const { isOpen } = this.state;
    const { isModalOpen } = this.state;
    const { value1 } = this.state;
    const dropdownItems = [
      <DropdownItem key="/">
        {mobileApp && selectedTab === TAB_BUILDS.key ? (
          <React.Fragment>
            <MenuItem onClick={() => this.setState({ showBuildConfigDialog: true })}>New build config</MenuItem>
            <BuildConfigDialog
              update={false}
              clientInfo={{ clientId: mobileApp.getName() }}
              show={showBuildConfigDialog}
              onShowStateChanged={isShown => this.setState({ showBuildConfigDialog: isShown })}
            />
          </React.Fragment>
            ) : (
              ''
            )}
          <DeleteItemButton itemType="app" itemName={this.props.match.params.id} navigate="/" />
      </DropdownItem>
    ];
    return mobileApp ? (
      <React.Fragment>
      <PageSection variant={PageSectionVariants.light} className="pf-u-pb-0">
        <Level>
          <LevelItem>
            <Breadcrumb>
              <BreadcrumbItem to="/overview">
                Mobile Apps
              </BreadcrumbItem>
              <BreadcrumbItem isActive>
                Review and Edit
              </BreadcrumbItem>
            </Breadcrumb>
          </LevelItem>
          <LevelItem>
            <Dropdown
              onSelect={this.onSelect}
              position={DropdownPosition.right}
              toggle={<DropdownToggle onToggle={this.onToggle} iconComponent={CaretDownIcon}>Actions</DropdownToggle>}
              isOpen={isOpen}
              dropdownItems={dropdownItems}
            />
          </LevelItem>
          </Level>
      </PageSection>
      <PageSection variant={PageSectionVariants.light} style={{ flex: '0', borderBottom: '1px solid #e0e0e0' }}>
        <Title headingLevel="h2" size="3xl">
          {mobileApp.getName()}
          <Button variant="plain" aria-label="Action" onClick={this.handleModalToggle}>
            <PencilAltIcon/>
          </Button>
          <span className="creation-timestamp">
            Created <Moment fromNow>{creationTimestamp}</Moment>
          </span>
        </Title>
        <Modal
          isSmall
          title="Edit mobile app name"
          isOpen={isModalOpen}
          onClose={this.handleModalToggle}
          actions={[
            <Button key="cancel" variant="secondary" onClick={this.handleModalToggle}>
              Cancel
            </Button>,
            <Button key="cancel" variant="primary" onClick={this.handleModalToggle}>
              Save
            </Button>
          ]}
        >
        <p className="pf-u-mb-lg">You may edit the mobile application name in the input below.</p>

        <Form>
          <FormGroup
            label="Application Name"
            fieldId="application-name"
          >
            <TextInput
              isRequired
              type="text"
              id="application-name"
              name="application-name"
              aria-describedby="application-name"
              value={value1}
              onChange={this.handleTextInputChange1}
            />
          </FormGroup>
        </Form>
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
              </div>
            </CardBody>
            <CardBody>
              <Title headingLevel="h4" size="lg" className="pf-u-mb-md">
                mobile-services.json
              </Title>
              <ClipboardCopy isReadOnly variant={ClipboardCopyVariant.expansion} className="mobile-client-config">
                <ConfigurationView/>
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
    </ React.Fragment>
    ) : (
      <React.Fragment />
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: state.apps,
    buildConfigs: state.buildConfigs,
    builds: state.builds,
    buildTabEnabled: state.config.buildTabEnabled
  };
}

const mapDispatchToProps = {
  fetchApp,
  fetchAndWatchBuildConfigs,
  fetchAndWatchBuilds,
  fetchAndWatchServices,
  fetchAndWatchApps
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Client);
