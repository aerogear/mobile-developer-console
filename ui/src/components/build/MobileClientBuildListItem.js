import React, { Component } from 'react';
import {
  DropdownKebab, MenuItem, Button, Row, Col,
} from 'patternfly-react';
import BuildStatus from '../common/BuildStatus';
import MobileListViewItem from '../common/MobileListViewItem';
import BuildConfigDetails from './BuildConfigDetails';
import ComponentSectionLabel from '../common/ComponentSectionLabel';
import MobileClientBuildHistoryList from './MobileClientBuildHistoryList';
import BuildInformation from './BuildInformation';
import NoBuild from './NoBuild';
import StartBuildButton from '../../containers/StartBuildButton';
import DeleteItemButton from '../../containers/DeleteItemButton';

const actions = id => (
  <React.Fragment>
    <StartBuildButton jobName={id} />
    <DropdownKebab id={`build-actions-${id}`} pullRight>
      <MenuItem>Edit</MenuItem>
      <DeleteItemButton itemName={id} itemType="buildconfig" />
    </DropdownKebab>
  </React.Fragment>
);

const buildConfig = buildConfiguration => ({
  jenkinsfilePath: buildConfiguration.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath,
  jobName: buildConfiguration.metadata.name,
  // TODO: consider other sources other than git as well
  branch: buildConfiguration.spec.source.git.ref || 'master',
  repoUrl: buildConfiguration.spec.source.git.uri,
});

const buildNumber = build => build && Number(build.metadata.annotations['openshift.io/build.number']);

const lastBuild = builds => builds.reduce((acc, curr) => (buildNumber(curr) > buildNumber(acc) ? curr : acc), null);

const buildHistory = (builds) => {
  const lastBuildNumber = buildNumber(lastBuild(builds));
  return builds
    .filter(build => buildNumber(build) !== lastBuildNumber)
    .sort((a, b) => buildNumber(b) - buildNumber(a));
};

const heading = (name, lastBuild) => (
  <div className="pull-left text-left">
    {
      lastBuild && (
        <span>
          <BuildStatus build={lastBuild} />
          {' '}
        </span>
      )
    }
    <a className="name">
      <span>{name}</span>
    </a>
  </div>
);

class MobileClientBuildListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileClientBuildConfigs: [],
      isHidden: true,
    };
  }

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden,
    });
  }

  historyButton() {
    if (this.state.isHidden) {
      return (
        <Button bsStyle="link" onClick={this.toggleHidden.bind(this)}>
          <span className="fa fa-angle-right fa-fw" aria-hidden="true" />
          {' '}
Show Build History
        </Button>
      );
    }
    return (
      <Button bsStyle="link" onClick={this.toggleHidden.bind(this)}>
        <span className="fa fa-angle-down fa-fw" aria-hidden="true" />
        {' '}
Hide Build History
      </Button>
    );
  }

  render = () => {
    const { buildConfiguration, appName } = this.props;
    const buildConfigName = buildConfiguration.metadata.name;
    const builds = buildConfiguration.builds || [];
    const lastClientBuild = lastBuild(builds);
    const clientBuildHistory = buildHistory(builds);
    const buildConfigDetails = buildConfig(buildConfiguration);

    return (
      <MobileListViewItem
        className="build-item"
        actions={actions(buildConfigName)}
        checkboxInput={false}
        heading={heading(buildConfigName, lastClientBuild)}
        hideCloseIcon
      >
        <Row>
          <Col md={12}>
            <ComponentSectionLabel>
                Build Config
            </ComponentSectionLabel>
            <BuildConfigDetails buildConfig={buildConfigDetails} />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <ComponentSectionLabel>
                Builds
            </ComponentSectionLabel>
            {
              builds.length === 0
                ? <NoBuild buildConfig={buildConfigDetails} />
                : (
                  <React.Fragment>
                    <BuildInformation appName={appName} build={lastClientBuild} />
                    {
                    clientBuildHistory.length > 0
                      ? (
                        <Row>
                          <Col md={12}>
                            <div className="mobile-chevron">
                              <a
                                href=""
                                onClick={(e) => {
                                  e.preventDefault();
                                  this.setState({ buildHistoryOpen: !this.state.buildHistoryOpen });
                                }}
                              >
                                <span className={this.state.buildHistoryOpen ? 'fa fa-angle-down' : 'fa fa-angle-right'} />&nbsp;
                                { this.state.buildHistoryOpen ? 'Hide' : 'Show' }
                                {' '}
build history
                              </a>
                            </div>
                            { this.state.buildHistoryOpen
                              ? <MobileClientBuildHistoryList appName={appName} className="collapse in" id="demo" mobileClientBuilds={clientBuildHistory} />
                              : <React.Fragment />
                          }
                          </Col>
                        </Row>
                      )
                      : <React.Fragment />
                  }
                  </React.Fragment>
                )
            }
          </Col>
        </Row>
      </MobileListViewItem>
    );
  }
}

export default MobileClientBuildListItem;
