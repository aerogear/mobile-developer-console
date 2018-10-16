import React, { Component } from 'react';
import {
  Nav,
  NavItem,
  TabContent,
  TabPane,
  TabContainer,
  Grid,
  Breadcrumb,
  DropdownButton,
  Alert,
  MenuItem
} from 'patternfly-react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ConfigurationView from '../components/configuration/ConfigurationView';
import MobileServiceView from '../components/mobileservices/MobileServiceView';
import { fetchApp } from '../actions/apps';
import { fetchBuildConfigs } from '../actions/buildConfigs';
import { fetchBuilds } from '../actions/builds';
import DataService from '../DataService';
import PlatformIcon from '../components/common/PlatformIcon';
import DeleteItemButton from './DeleteItemButton';

import '../components/common/Client.css';
import { MobileClientBuildOverviewList } from '../components/build/MobileClientBuildOverviewList';

import BuildConfigDialog from './BuildConfigDialog';
import { KEY_CR_CLIENT_ID, KEY_CR_CLIENT_TYPE } from '../components/build/Constants';

const TAB_CONFIGURATION = 1;
const TAB_BUILDS = 2;
const TAB_MOBILE_SERVICES = 3;

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buildConfigs: [],
      selectedTab: TAB_CONFIGURATION
    };
    this.handleNavSelect = this.handleNavSelect.bind(this);
  }

  componentDidMount() {
    const appName = this.props.match.params.id;

    this.props.fetchApp(appName);
    this.wsApps = DataService.watchApps(() => this.props.fetchApp(appName));

    if (this.props.buildTabEnabled) {
      this.props.fetchBuildConfigs();
      this.props.fetchBuilds();

    this.wsBuildConfigs = DataService.watchBuildConfigs(this.props.fetchBuildConfigs);
    this.wsBuilds = DataService.watchBuilds(this.props.fetchBuilds);
  }

  componentWillUnmount() {
    this.wsApps && this.wsApps.close();
    this.wsBuildConfigs && this.wsBuildConfigs.close();
    this.wsBuilds && this.wsBuilds.close();
  }

  componentDidUpdate(prevProps) {
    if (this.props.buildConfigs !== prevProps.buildConfigs || this.props.builds !== prevProps.builds) {
      const mobileApp = this.getMobileApp();
      if (mobileApp.spec) {
        const configs = this.props.buildConfigs.items.filter(
          config => config.metadata.labels['mobile-client-id'] === mobileApp.spec.AppIdentifier
        );

        configs.forEach(config => delete config.builds);

        this.props.builds.items.forEach(build => {
          const matchingConfig = configs.find(config => config.metadata.name === build.metadata.labels.buildconfig);
          if (matchingConfig) {
            matchingConfig.builds = matchingConfig.builds || [];
            matchingConfig.builds.push(build);
            this.setState({ matchingConfig });
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

  header = (clientType, config) => {
    const { selectedTab, showBuildConfigDialog = false } = this.state;
    return (
      <div className="app-header-wrapper">
        <div className="app-header">
          <PlatformIcon small platform={clientType} />
          <div>
            <span className="platform">{clientType}</span>
            <h1>{this.props.match.params.id}</h1>
          </div>
        </div>
        <div className="app-actions-dropdown">
          <DropdownButton id="app-actions-dropdown" title="Actions" pullRight>
            {config && selectedTab === TAB_BUILDS ? (
              <React.Fragment>
                <MenuItem onClick={() => this.setState({ showBuildConfigDialog: true })}>New build config</MenuItem>
                <BuildConfigDialog
                  update={false}
                  initialConfig={config}
                  show={showBuildConfigDialog}
                  onShowStateChanged={isShown => this.setState({ showBuildConfigDialog: isShown })}
                />
              </React.Fragment>
            ) : (
              ''
            )}
            <DeleteItemButton itemType="app" itemName={this.props.match.params.id} navigate="/" />
          </DropdownButton>
        </div>
      </div>
    );
  };

  render() {
    const mobileApp = this.getMobileApp();
    const { metadata = {}, spec = {} } = mobileApp;
    const { appName = '' } = metadata;
    const { clientType = '', AppIdentifier: clientId = '' } = spec;
    const config = { [KEY_CR_CLIENT_ID]: clientId, [KEY_CR_CLIENT_TYPE]: clientType };
    const { selectedTab } = this.state;

    return (
      <Grid fluid className="client-details">
        <Breadcrumb>
          <Breadcrumb.Item active>
            <Link to="/overview">Mobile Apps</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{this.props.match.params.id}</Breadcrumb.Item>
        </Breadcrumb>
        {mobileApp && this.header(clientType, config)}
        {this.props.apps.readingError ? (
          <Alert>{this.props.apps.readingError.message}</Alert>
        ) : (
          <TabContainer id="basic-tabs-pf" activeKey={selectedTab} onSelect={this.handleNavSelect}>
            <div>
              <Nav bsClass="nav nav-tabs nav-tabs-pf nav-tabs-pf-secondary">
                <NavItem eventKey={TAB_CONFIGURATION}>Configuration</NavItem>
                {this.props.buildTabEnabled ? (<NavItem eventKey={TAB_BUILDS}>Builds</NavItem>) : null }
                <NavItem eventKey={TAB_MOBILE_SERVICES}>Mobile Services</NavItem>
              </Nav>
              <TabContent>
                <TabPane eventKey={TAB_CONFIGURATION}>
                  <ConfigurationView app={mobileApp} />
                </TabPane>
                {this.props.buildTabEnabled? (<TabPane eventKey={TAB_BUILDS}>
                  <MobileClientBuildOverviewList
                    appName={appName}
                    config={config}
                    buildConfigs={this.state.buildConfigs}
                  />
                </TabPane>):null}
                <TabPane eventKey={TAB_MOBILE_SERVICES}>
                  <MobileServiceView  appName={appName} />
                </TabPane>
              </TabContent>
            </div>
          </TabContainer>
        )}
      </Grid>
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
  fetchBuildConfigs,
  fetchBuilds
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Client);
