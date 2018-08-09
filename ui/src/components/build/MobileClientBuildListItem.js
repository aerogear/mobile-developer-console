import React, { Component } from 'react';
import { DropdownKebab, MenuItem, Button, Row, Col} from 'patternfly-react';
import BuildStatus from '../common/BuildStatus';
import MobileListViewItem from '../common/MobileListViewItem';
import BuildConfigDetails from './BuildConfigDetails';
import ComponentSectionLabel from '../common/ComponentSectionLabel';
import MobileClientBuildHistoryList from './MobileClientBuildHistoryList';
import BuildInformation from './BuildInformation';
import NoBuild from './NoBuild';

const actions = id => (
  <React.Fragment>
    <Button>
      Start Build
    </Button>
    <DropdownKebab id={'build-actions-' + id} pullRight>
      <MenuItem>Edit</MenuItem>
      <MenuItem>Delete</MenuItem>
    </DropdownKebab>
  </React.Fragment>
);

const buildConfig = buildConfiguration => ({
    jenkinsfilePath: buildConfiguration.spec.strategy.jenkinsPipelineStrategy.jenkinsfilePath,
    jobName: buildConfiguration.metadata.name,
    // TODO: consider other sources other than git as well
    branch: buildConfiguration.spec.source.git.ref || 'master',
    repoUrl: buildConfiguration.spec.source.git.uri
});

const buildNumber = build => build && build.metadata.annotations['openshift.io/build.number'];

const lastBuild = builds => builds.reduce((acc, curr) =>
    buildNumber(curr) > buildNumber(acc) ? curr : acc, null
);

const buildHistory = builds => {
    const lastBuildNumber = buildNumber(lastBuild(builds));
    return builds.filter(build => buildNumber(build) !== lastBuildNumber)
};

const heading = (name, lastBuild) => (
    <div className="pull-left text-left">
        <a className="name">
          {
            lastBuild ?
              <span>
                  <BuildStatus build={lastBuild} />
              </span>
            :
              <React.Fragment />
          }
          <span>{name}</span>
        </a>
    </div>
);

class MobileClientBuildListItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      mobileClientBuildConfigs: [],
      isHidden: true
    };
  }

  toggleHidden () {
    this.setState({
      isHidden: !this.state.isHidden
    })
  }

  historyButton () {
    if (this.state.isHidden) {
      return (
        <Button bsStyle="link" onClick={this.toggleHidden.bind(this)} >
        <span className="fa fa-angle-right fa-fw" aria-hidden="true"></span> Show Build History </Button>
      )
    } else {
      return (
        <Button bsStyle="link" onClick={this.toggleHidden.bind(this)} >
        <span className="fa fa-angle-down fa-fw" aria-hidden="true"></span> Hide Build History </Button>
      )
    }
  }

  render = () => {
      const { buildConfiguration } = this.props;
      const buildConfigName = buildConfiguration.metadata.name;
      const builds = buildConfiguration.builds || [];
      const lastClientBuild = lastBuild(builds);
      const clientBuildHistory = buildHistory(builds);

      return (
          <MobileListViewItem
              className="build-item"
              actions={actions(buildConfigName)}
              checkboxInput={false}
              heading={heading(buildConfigName, lastClientBuild)}
              hideCloseIcon={true}
          >
          <Row>
            <Col md={12}>
              <ComponentSectionLabel>
                Build Config
              </ComponentSectionLabel>
              <BuildConfigDetails buildConfig={buildConfig(buildConfiguration)}/>
            </Col>
            <Col md={12}>
              <ComponentSectionLabel>
                Builds
              </ComponentSectionLabel>
              {
                builds.length === 0 ?
                  <NoBuild />
                :
                  <React.Fragment>
                    <BuildInformation build={lastClientBuild} />
                    {
                        clientBuildHistory.length > 0 ?
                          <Row>
                              <Col md={12}>
                                  <div className="mobile-chevron">
                                      <a
                                          href=""
                                          onClick={e => {
                                              e.preventDefault();
                                              this.setState({ buildHistoryOpen: !this.state.buildHistoryOpen })
                                          }}
                                      >
                                          <span className={ this.state.buildHistoryOpen ? "fa fa-angle-down" : "fa fa-angle-right" } />&nbsp;
                                          { this.state.buildHistoryOpen ? 'Hide' : 'Show' } build history
                                      </a>
                                  </div>
                                  { this.state.buildHistoryOpen ?
                                      <MobileClientBuildHistoryList className="collapse in" id="demo" mobileClientBuilds={clientBuildHistory}/>
                                      :
                                      <React.Fragment />
                                  }
                              </Col>
                          </Row>
                      :
                          <React.Fragment />
                    }
                  </React.Fragment>
              }
            </Col>
          </Row>
          </MobileListViewItem>
      );
  }
}

export default MobileClientBuildListItem;
