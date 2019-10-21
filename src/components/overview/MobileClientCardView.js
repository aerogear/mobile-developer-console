import React, { Component } from 'react';
import {
  Button,
  Gallery,
  GalleryItem,
  EmptyState,
  EmptyStateBody,
  EmptyStateVariant,
  EmptyStateIcon,
  InputGroup,
  TextInput,
  Title,
  PageSection,
  PageSectionVariants
} from '@patternfly/react-core';
import {
  DataToolbar,
  DataToolbarItem,
  DataToolbarContent,
  DataToolbarFilter
} from '@patternfly/react-core/dist/esm/experimental';
import { MobileAltIcon, SearchIcon } from '@patternfly/react-icons';
import './MobileClientCardView.css';
import './MobileClientCardViewItem.css';
import MobileClientCardViewItem from './MobileClientCardViewItem';
import CreateClient from '../../containers/CreateClient';

class MobileClientCardView extends Component {
  constructor(props) {
    super(props);
    this.state = { filters: [], currentValue: '' };

    this.emptyStateMessage = {
      noAppsCreatedTitle: "You don't have any Mobile Apps.",
      noAppsCreated: 'JavaScript-based mobile apps can be configured for a variety of mobile platforms.',
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

  onClick() {
    const { currentValue } = this.state;
    if (currentValue && currentValue.length > 0) {
      this.setState({ currentValue: '' });
      this.setFilter(currentValue);
    }
  }

  getEmptyState() {
    return (
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateIcon icon={MobileAltIcon} />
        <Title headingLevel="h5" size="lg">
          {this.emptyStateMessage.noAppsCreatedTitle}
        </Title>
        <EmptyStateBody>{this.emptyStateMessage.noAppsCreated}</EmptyStateBody>
        <CreateClient createButtonSize="large" />
      </EmptyState>
    );
  }

  setFilter(filterValue) {
    this.setState({ filters: [...this.state.filters, filterValue] });
  }

  removeFilter = (type = '', id = '') => {
    if (id) {
      this.setState(prevState => {
        prevState.filters = prevState.filters.filter(s => s !== id);
        return {
          filters: prevState.filters
        };
      });
    }
  };

  clearFilters = () => {
    this.setState({ filters: [] });
  };

  updateCurrentValue(value) {
    this.setState({ currentValue: value });
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
        const { filters } = this.state;
        return clientAppName.indexOf(filters) > -1 ? (
          <MobileClientCardViewItem
            key={clientAppName}
            app={app}
            services={app.status.services}
            builds={this.getBuilds(app)}
            buildTabEnabled={this.props.buildTabEnabled}
          />
        ) : null;
      })
      .filter(app => app !== null);
  }

  renderAppCards() {
    const { mobileClients } = this.props;
    const filteredClients = this.filterClients(mobileClients);
    return filteredClients.length ? (
      <Gallery gutter="md">
        {filteredClients.map((x, i) => (
          <GalleryItem key={i}>{x}</GalleryItem>
        ))}
      </Gallery>
    ) : (
      <EmptyState>
        <EmptyStateIcon icon={MobileAltIcon} />
        <Title headingLevel="h5" size="lg">
          {this.emptyStateMessage.noAppsAfterFiltering}
        </Title>
      </EmptyState>
    );
  }

  render() {
    const { mobileClients } = this.props;
    const { filters } = this.state;
    const filteredClients = this.filterClients(mobileClients);
    return (
      <div className="overview">
        <PageSection variant={PageSectionVariants.light} className="pf-c-page__main-section">
          <Title className="overview-title" headingLevel="h2" size="3xl">
            Mobile Apps
            <span className="create-button">
              <CreateClient />
            </span>
          </Title>
          <br />
          <DataToolbar clearAllFilters={this.clearFilters} showClearFiltersButton={filters.length !== 0}>
            <DataToolbarContent>
              <DataToolbarItem>
                <InputGroup>
                  <TextInput
                    placeholder="Filter by name..."
                    className="datatoolbarInput"
                    type="search"
                    onChange={e => this.updateCurrentValue(e)}
                    onKeyPress={e => this.onValueKeyPress(e)}
                  />
                  <Button variant="tertiary" onClick={e => this.onClick(e)}>
                    <SearchIcon />
                  </Button>
                </InputGroup>
              </DataToolbarItem>
              <DataToolbarItem>
                <DataToolbarFilter
                  className="toolbarFilter"
                  chips={this.state.filters}
                  deleteChip={this.removeFilter}
                />
              </DataToolbarItem>
              {/* {filters && filters.length > 0 && mobileClients.filterClients} */}
              <DataToolbarItem breakpointMods={[{ modifier: 'align-right' }]}>
                {filteredClients ? filteredClients.length : mobileClients.length} of {mobileClients.length} items
              </DataToolbarItem>
            </DataToolbarContent>
          </DataToolbar>
        </PageSection>
        <PageSection className="card-gallery" style={{ height: '100vh' }}>
          {mobileClients.length ? this.renderAppCards() : this.getEmptyState()}
        </PageSection>
      </div>
    );
  }
}

export default MobileClientCardView;
