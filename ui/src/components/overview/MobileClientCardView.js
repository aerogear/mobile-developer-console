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

const mockServices = [{ type: 'metrics' }, { type: 'keycloak' }, { type: 'sync' }, { type: 'push' }];

const mockBuilds = [{ status: 'success' }, { status: 'failed' }, { status: 'success' }, { status: 'failed' }];

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
          <CreateClient createButtonSize="large" />
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

  filterClients(mobileClients) {
    return mobileClients
      .map(app => {
        const {
          metadata: { name: clientAppName }
        } = app;
        const { filter } = this.state;
        return clientAppName.indexOf(filter) > -1 ? (
          <MobileClientCardViewItem key={clientAppName} app={app} services={mockServices} builds={mockBuilds} />
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
            <CreateClient />
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
