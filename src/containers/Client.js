import React, { Component } from 'react';
import {
  Nav,
  NavItem,
  TabContent,
  TabPane,
  TabContainer,
  Grid,
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
  DataList,
  DataListItem,
  DataListItemRow,
  DataListCell,
  DataListAction,
  DataListToggle,
  DataListContent,
  DataListCheck,
  DataListItemCells,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle
} from '@patternfly/react-core';
import { connect } from 'react-redux';
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
      selectedTab: initialTab.key
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

  header = mobileApp => {
    const { selectedTab, showBuildConfigDialog = false } = this.state;
    const { creationTimestamp = null } = mobileApp.metadata.data;
    // passing empty string to build config dialog for now as the client id.
    return (
      <div className="app-header-wrapper">
        <div className="app-header">
          <div>
            <h1>
              {mobileApp.getName()}
              <span className="creation-timestamp">
                created <Moment fromNow>{creationTimestamp}</Moment>
              </span>
            </h1>
          </div>
        </div>
        {/* <div className="app-actions-dropdown">
          <DropdownButton id="app-actions-dropdown" title="Actions" pullRight>
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
          </DropdownButton>
        </div> */}
      </div>
    );
  };

  render() {
    const mobileApp = this.getMobileApp();
    const clientInfo = { clientId: mobileApp.getName() };
    const { selectedTab } = this.state;
    const appName = this.props.match.params.id;
    const cardWidth = {width: '300px'};
    const { creationTimestamp = null } = mobileApp.metadata.data;
    return mobileApp ? (
      <div>
      <PageSection variant={PageSectionVariants.light}>
        <Level>
          <LevelItem>
            <Breadcrumb>
              <BreadcrumbItem to="/overview">
                Mobile Apps
              </BreadcrumbItem>
              <BreadcrumbItem isActives>
                Review and Edit
              </BreadcrumbItem>
            </Breadcrumb>
          </LevelItem>
          <LevelItem>
            Dropdown
          </LevelItem>
          </Level>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2" size="3xl">
          {mobileApp.getName()}
        </Title>
          <span className="creation-timestamp">
            created <Moment fromNow>{creationTimestamp}</Moment>
          </span>
      </PageSection>
      <Split>
        <SplitItem isFilled>
          <PageSection>
            <Title headingLevel="h3" size="xl">
              Bound Services
            </Title>
            <DataList aria-label="Exapandable data list example">
              Data list here
            </DataList>
          </PageSection>
        </SplitItem>
        <SplitItem>
          <Card style={cardWidth}>
            <CardBody>
              <Title headingLevel="h3" size="xl">
                Full Mobile Config
              </Title>
              <p> 
                JavaScript-based mobile apps can be configured for a variety of mobile platforms. 
                Our JavaScript SDK supports the following frameworks.
              </p>
              <div>
                Add icons in here
              </div>
            </CardBody>
            <CardBody>
              <Title headingLevel="h4" size="md">
                mobile-services.json
              </Title>
            </CardBody>
          </Card>
        </SplitItem> 
      </Split>
      <Grid fluid className="client-details">
        {/* <Breadcrumb>
          <Breadcrumb.Item active>
            <Link to="/overview">Mobile Apps</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{mobileApp.getName()}</Breadcrumb.Item>
        </Breadcrumb> */}
        {this.header(mobileApp)}
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
                  <MobileServiceView appName={appName} />
                </TabPane>
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
      </Grid>
    </div>
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
