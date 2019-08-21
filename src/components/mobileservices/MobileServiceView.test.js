import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { MobileServiceView } from './MobileServiceView';

describe('MobileServiceView', () => {
  const store = {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn()
  };

  it('component loads', () => {
    const props = {
      boundServices: [],
      unboundServices: []
    };

    const wrapper = shallow(
      <MobileServiceView
        appName="appName"
        appUid="0e35c6cf-0792-4d7a-952d-05618cca6a6e"
        boundServices={props.boundServices}
        unboundServices={props.unboundServices}
        fetchAndWatchServices={() => 'appName'}
      />
    );
    expect(wrapper.exists()).toEqual(true);
  });

  it('has unboundServices', () => {
    const props = {
      boundServices: [],
      unboundServices: [
        {
          getId: () => 'service1 id',
          getDescription: () => 'sample service1',
          getIconClass: () => '/img/push.svg',
          isBindingOperationInProgress: () => false,
          isBindingOperationFailed: () => false
        },
        {
          getId: () => 'service2 id',
          getDescription: () => 'sample service2',
          getIconClass: () => '/img/push.svg',
          isBindingOperationInProgress: () => false,
          isBindingOperationFailed: () => false
        }
      ]
    };

    const wrapper = shallow(
      <MobileServiceView
        appName="appName"
        appUid="0e35c6cf-0792-4d7a-952d-05618cca6a6e"
        boundServices={props.boundServices}
        unboundServices={props.unboundServices}
        fetchAndWatchServices={() => 'appName'}
      />
    );

    let unbound = wrapper.find('UnboundServiceRow').at(0);
    expect(unbound.render().text()).toContain(props.unboundServices[0].getId());

    unbound = wrapper.find('UnboundServiceRow').at(1);
    expect(unbound.render().text()).toContain(props.unboundServices[1].getId());
  });

  it('has boundServices', () => {
    const props = {
      boundServices: [
        {
          getId: () => 'service1 id',
          getConfiguration: () => undefined,
          getDescription: () => 'sample service1',
          getIconClass: () => '/img/push.svg',
          isBindingOperationInProgress: () => false,
          isBindingOperationFailed: () => false,
          isUPSService: () => false,
          getDocumentationUrl: () => undefined,
          getCustomResourcesForApp: () => [
            {
              getName: () => 'test-data-sync-r66b9',
              getPlatform: () => undefined
            }
          ],
          data: {
            type: 'push'
          }
        },
        {
          getId: () => 'service2 id',
          getConfiguration: () => undefined,
          getDescription: () => 'sample service2',
          getIconClass: () => '/img/push.svg',
          isBindingOperationInProgress: () => false,
          isBindingOperationFailed: () => false,
          isUPSService: () => false,
          getDocumentationUrl: () => undefined,
          getCustomResourcesForApp: () => [
            {
              getName: () => 'test-data-sync-r66b9',
              getPlatform: () => undefined
            }
          ],
          data: {
            type: 'push'
          }
        }
      ],
      unboundServices: []
    };

    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <MobileServiceView
            appName="appName"
            appUid="0e35c6cf-0792-4d7a-952d-05618cca6a6e"
            boundServices={props.boundServices}
            unboundServices={props.unboundServices}
            fetchAndWatchServices={() => 'appName'}
          />
        </BrowserRouter>
      </Provider>
    );

    const boundService = wrapper.find('BoundServiceRow');

    expect(boundService).toHaveLength(props.boundServices.length);
    for (let i = 0; i < boundService.length; i++) {
      const bound = wrapper.find('BoundServiceRow').at(i);
      expect(bound.render().text()).toContain(props.boundServices[i].getId());
    }
  });

  it('triggers getConfigurationOptions', () => {
    const expected = 'http://example.com';
    const props = {
      app: {
        status: {
          data: {
            services: {
              name: 'security',
              find: () => ({ url: 'http://example.com' })
            }
          }
        }
      },
      boundServices: [
        {
          getId: () => 'service1 id',
          getConfiguration: () => [{ label: 1, value: 'http://example.com' }],
          getDescription: () => 'sample service1',
          getIconClass: () => '/img/push.svg',
          isBindingOperationInProgress: () => false,
          isBindingOperationFailed: () => false,
          isUPSService: () => false,
          getDocumentationUrl: () => undefined,
          getCustomResourcesForApp: () => [
            {
              getName: () => 'sampel-service',
              getPlatform: () => undefined
            }
          ],
          data: {
            type: 'security'
          }
        }
      ],
      unboundServices: []
    };

    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <MobileServiceView
            appName="appName"
            appUid="0e35c6cf-0792-4d7a-952d-05618cca6a6e"
            boundServices={props.boundServices}
            unboundServices={props.unboundServices}
            fetchAndWatchServices={() => 'appName'}
            app={props.app}
          />
        </BrowserRouter>
      </Provider>
    );

    const service = wrapper.find('.list-group-item.boundService').at(0);
    const serviceHeader = service.find('.list-group-item-header');
    serviceHeader.simulate('click');
    expect(service.html()).toContain(expected);
  });

  it('delete bound service', () => {
    const props = {
      app: {
        status: {
          data: {
            services: {
              name: 'security',
              find: () => ({ url: 'http://example.com' })
            }
          }
        }
      },
      boundServices: [
        {
          getId: () => 'service1 id',
          getConfiguration: () => [{ label: 1, value: 'http://example.com' }],
          getDescription: () => 'sample service1',
          getIconClass: () => '/img/push.svg',
          isBindingOperationInProgress: () => false,
          isBindingOperationFailed: () => false,
          isUPSService: () => false,
          getDocumentationUrl: () => undefined,
          getCustomResourcesForApp: () => [
            {
              getName: () => 'sampel-service',
              getPlatform: () => undefined
            }
          ],
          data: {
            type: 'security'
          }
        }
      ],
      unboundServices: []
    };

    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <MobileServiceView
            appName="appName"
            appUid="0e35c6cf-0792-4d7a-952d-05618cca6a6e"
            boundServices={props.boundServices}
            unboundServices={props.unboundServices}
            fetchAndWatchServices={() => 'appName'}
            app={props.app}
          />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.html()).toContain('There are no unbound services');
    const service = wrapper.find('.list-group-item.boundService').at(0);
    const dropdown = service.find('.dropdown-kebab-pf.dropdown.btn-group #delete-binding-id').at(0);
    dropdown.simulate('click');
    const deleteApp = service.find('.dropdown-menu.dropdown-menu-right li a').at(0);

    expect(deleteApp.simulate('click')).toHaveLength(1);
  });
});
