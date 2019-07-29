import React, { Component } from 'react';
import { Filter } from 'patternfly-react';
import { Form, FormGroup, Toolbar, ToolbarSection, Gallery, GalleryItem, ToolbarGroup } from '@patternfly/react-core';
import { EmptyState, EmptyStateBody, EmptyStateVariant, EmptyStateIcon, Title } from '@patternfly/react-core';
import { MobileAltIcon } from '@patternfly/react-icons';
import DebounceInput from 'react-debounce-input';
import './MobileClientCardView.css';
import MobileClientCardViewItem from './MobileClientCardViewItem';
import CreateClient from '../../containers/CreateClient';

class MobileClientCardView extends Component {
  constructor(props) {
    super(props);
    this.state = { filter: '', currentValue: '' };

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
    this.setState({ filter: filterValue });
  }

  removeFilter() {
    this.setState({ filter: '', currentValue: '' });
  }

  updateCurrentValue(event) {
    const { value } = event.target;
    this.setState({ currentValue: value });
    this.setFilter(value);
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
      <Gallery mCardGridatchHeight fluid>
        <GalleryItem key={1}>{filteredClients}</GalleryItem>
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
    const { filter, currentValue } = this.state;
    return (
      <div className="overview">
        <Toolbar>
          <ToolbarSection className="toolbarContainer">
            <ToolbarGroup>
              <Form>
                <FormGroup>
                  <DebounceInput
                    minLength={1}
                    debounceTimeout={300}
                    type="text"
                    placeholder="Filter by Name"
                    className="toolbarFilter"
                    value={currentValue}
                    onChange={e => this.updateCurrentValue(e)}
                    onKeyPress={e => this.onValueKeyPress(e)}
                  />
                </FormGroup>
              </Form>
            </ToolbarGroup>
            <ToolbarGroup>
              <div className="form-group">
                <CreateClient />
              </div>
            </ToolbarGroup>
          </ToolbarSection>
          <ToolbarSection>
            {filter && filter.length > 0 && (
              <>
                <Filter.ActiveLabel>Active Filters:</Filter.ActiveLabel>
                <Filter.List>
                  <Filter.Item key="1" filterData={{ filter }} onRemove={e => this.removeFilter(e)}>
                    {filter}
                  </Filter.Item>
                </Filter.List>
              </>
            )}
          </ToolbarSection>
        </Toolbar>
        {mobileClients.length ? this.renderAppCards() : this.getEmptyState()}
      </div>
    );
  }
}

export default MobileClientCardView;
