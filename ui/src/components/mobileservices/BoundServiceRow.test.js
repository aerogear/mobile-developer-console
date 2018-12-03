/* eslint guard-for-in: 0 */

import { shallow, mount } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import BoundServiceRow from './BoundServiceRow';

const store = {
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: jest.fn()
};

describe('BoundServiceRow - not UPS', () => {
  const service = {
    getConfiguration: () => undefined,
    getConfigurationExt: () => undefined,
    getDocumentationUrl: () => undefined,
    getIconClass: () => 'fa fa-refresh',
    getId: () => 'Data Sync',
    getLogoUrl: () => undefined,
    getName: () => 'Data Sync',
    isUPSService: () => false,
    serviceBindings: [
      {
        getName: () => 'test-data-sync-r66b9',
        getPlatform: () => undefined
      }
    ]
  };
  it('should render the row with bound service', () => {
    const wrapper = shallow(<BoundServiceRow service={service} />);
    expect(wrapper.find('ListViewItem')).toHaveLength(1);
  });

  it('should display documentation URL in the service row', () => {
    service.getDocumentationUrl = () => 'http://test-url.com';
    const wrapper = shallow(<BoundServiceRow service={service} />);
    expect(wrapper.find(`a[href="${service.getDocumentationUrl()}"]`).text()).toEqual('SDK Setup ');
  });

  it('should display configuration details in the service row', () => {
    const configurationUrl = 'http://configuration-url.com';
    service.getConfiguration = () => [
      `{
        "label": "test-label",
        "type": "href",
        "value": "${configurationUrl}"
      }`
    ];
    const wrapper = shallow(<BoundServiceRow service={service} />);
    expect(wrapper.find(`a[href="${configurationUrl}"]`).text()).toEqual(configurationUrl);
  });
  it('should not render the bind button', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindButton')).toHaveLength(0);
  });
  it('should not render the binding status', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindingStatus')).toHaveLength(0);
  });
});

describe('BoundServiceRow - UPS - 1 binding', () => {
  const service = {
    getConfiguration: () => undefined,
    getConfigurationExt: () => `[
      {"type":"android","typeLabel":"Android","url":"https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/2d76d1eb-65ef-471c-8d21-75f80c3f370f","id":"2d76d1eb-65ef-471c-8d21-75f80c3f370f"}
    ]`,
    getDocumentationUrl: () => undefined,
    getIconClass: () => 'fa fa-something',
    getId: () => 'UPS',
    getLogoUrl: () => undefined,
    getName: () => 'UPS',
    isUPSService: () => true,
    isBindingOperationInProgress: () => false,
    isBindingOperationFailed: () => false,
    getBindingSchema: () => undefined,
    getFormDefinition: () => undefined,
    isBound: () => true,
    serviceBindings: [
      {
        getName: () => 'test-ups-r66b9',
        getPlatform: () => 'android'
      }
    ]
  };
  it('should render the bind button', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindButton')).toHaveLength(1);
    expect(wrapper.find('DeleteItemButton')).toHaveLength(1);
  });
  it('should render the binding status', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindingStatus')).toHaveLength(1);
  });
});

describe('BoundServiceRow - UPS - 2 bindings', () => {
  const service = {
    getConfiguration: () => undefined,
    getConfigurationExt: () => `[
      {"type":"android","typeLabel":"Android","url":"https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/2d76d1eb-65ef-471c-8d21-75f80c3f370f","id":"2d76d1eb-65ef-471c-8d21-75f80c3f370f"},
      {"type":"ios","typeLabel":"iOS","url":"https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/c8d70b96-bd52-499c-845b-756089e06d36","id":"c8d70b96-bd52-499c-845b-756089e06d36"}
    ]`,
    getDocumentationUrl: () => undefined,
    getIconClass: () => 'fa fa-something',
    getId: () => 'UPS',
    getLogoUrl: () => undefined,
    getName: () => 'UPS',
    isUPSService: () => true,
    isBindingOperationInProgress: () => false,
    isBindingOperationFailed: () => false,
    getBindingSchema: () => undefined,
    getFormDefinition: () => undefined,
    isBound: () => true,
    serviceBindings: [
      {
        getName: () => 'test-ups-r66b9',
        getPlatform: () => 'android'
      },
      {
        getName: () => 'test-ups-r66b8',
        getPlatform: () => 'ios'
      }
    ]
  };
  it('should not render the bind button', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindButton')).toHaveLength(0);
    expect(wrapper.find('DeleteItemButton')).toHaveLength(2);
  });
  it('should render the binding status', () => {
    // normally we show the binding status in the UnboundServiceRow, not in the bound one.
    // but, as there might be a binding in progress, we still need to show this status in BoundServiceRow too
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindingStatus')).toHaveLength(1);
  });
});
