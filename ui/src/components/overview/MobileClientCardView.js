import React, { Component } from 'react';
import {
  Toolbar,
  Filter,
  FormControl,
  EmptyState,
  EmptyStateTitle,
  EmptyStateAction,
  CardGrid
} from 'patternfly-react';
import './MobileClientCardView.css';
import MobileClientCardViewItem from './MobileClientCardViewItem';
import CreateClient from '../../containers/CreateClient';
import {
  PLATFORM_ANDROID,
  PLATFORM_IOS,
  PLATFORM_CORDOVA,
  PLATFORM_XAMARIN,
} from '../../components/create_client/Constants';

class MobileClientCardView extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: '', currentValue: '' };
    this.emptyStateMessage = {
      noAppsCreated: 'You have no mobile apps right now. Create one to get started.',
      noAppsAfterFiltering: 'No mobile apps match the entered filter.'
    };
  }

  onValueKeyPress(keyEvent) {
    const { currentValue } = this.state;
    if (keyEvent.key === 'Enter' && currentValue && currentValue.length > 0) {
      this.setState({ currentValue: '' });
      this.setFilter(currentValue);
      keyEvent.stopPropagation();
      keyEvent.preventDefault();
    }
  }

  getEmptyState() {
    return (
      <EmptyState>
        <EmptyStateTitle>{this.emptyStateMessage.noAppsCreated}</EmptyStateTitle>
        <EmptyStateAction>
          <CreateClient createButtonSize="large" platforms={[PLATFORM_ANDROID, PLATFORM_CORDOVA, PLATFORM_IOS, PLATFORM_XAMARIN]}/>
        </EmptyStateAction>
      </EmptyState>
    );
  }

  setFilter(filterValue) {
    this.setState({ filter: filterValue });
  }

  removeFilter() {
    this.setState({ filter: '' });
  }

  updateCurrentValue(event) {
    this.setState({ currentValue: event.target.value });
  }

  getBuilds = app => {
    const { mobileClientBuilds } = this.props;
    const builds = mobileClientBuilds.filter(build => build.metadata.labels['mobile-client-id'] === app.metadata.name);
    const lastBuilds = builds.reduce((prev, curr) => {
      const bcName = curr.metadata.annotations['openshift.io/build-config.name'];
      const buildNumber = curr.metadata.annotations['openshift.io/build.number'];
      const buildStatus = curr.status.phase;
      if (!prev[bcName] || prev[bcName].buildNumber < buildNumber) {
        prev[bcName] = {
          buildNumber,
          buildStatus
        };
      }
      return prev;
    }, {});
    let numFailedBuilds = 0;
    for (const build in lastBuilds) {
      if (lastBuilds[build].buildStatus === 'Failed') {
        numFailedBuilds++;
      }
    }
    const numInProgressBuilds = builds.filter(build => build.status.phase === 'Running').length;
    return {
      numFailedBuilds,
      numInProgressBuilds
    };
  };

  filterClients(mobileClients) {
    return mobileClients
      .map(app => {
        const {
          metadata: { name: clientAppName }
        } = app;
        const { filter } = this.state;
        return clientAppName.indexOf(filter) > -1 ? (
          <MobileClientCardViewItem
            key={clientAppName}
            app={app}
            services={app.status.services}
            builds={this.getBuilds(app)}
          />
        ) : null;
      })
      .filter(app => app !== null);
  }

  renderAppCards() {
    const { mobileClients } = this.props;
    const filteredClients = this.filterClients(mobileClients);
    return filteredClients.length ? (
      <CardGrid matchHeight fluid>
        <CardGrid.Row key={1}>{filteredClients}</CardGrid.Row>
      </CardGrid>
    ) : (
      <EmptyState>
        <EmptyStateTitle>{this.emptyStateMessage.noAppsAfterFiltering}</EmptyStateTitle>
      </EmptyState>
    );
  }

  render() {
    const { mobileClients } = this.props;
    const { filter, currentValue } = this.state;
    return (
      <div className="overview">
        <Toolbar>
          <Filter>
            <FormControl
              type="text"
              placeholder="Filter by name"
              value={currentValue}
              onChange={e => this.updateCurrentValue(e)}
              onKeyPress={e => this.onValueKeyPress(e)}
            />
          </Filter>
          <div className="form-group">
            <CreateClient platforms={[PLATFORM_ANDROID, PLATFORM_CORDOVA, PLATFORM_IOS, PLATFORM_XAMARIN]} />
          </div>
          {filter &&
            filter.length > 0 && (
              <Toolbar.Results>
                <Filter.ActiveLabel>Active Filters:</Filter.ActiveLabel>
                <Filter.List>
                  <Filter.Item key="1" filterData={{ filter }} onRemove={e => this.removeFilter(e)}>
                    {filter}
                  </Filter.Item>
                </Filter.List>
              </Toolbar.Results>
            )}
        </Toolbar>
        {mobileClients.length ? this.renderAppCards() : this.getEmptyState()}
      </div>
    );
  }
}

export default MobileClientCardView;
