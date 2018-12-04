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
    getConfigurationExtAsJSON: () => undefined,
    getDocumentationUrl: () => undefined,
    getBindingName: () => 'test-data-sync-r66b9',
    getIconClass: () => 'fa fa-refresh',
    getId: () => 'Data Sync',
    getLogoUrl: () => undefined,
    getName: () => 'Data Sync',
    isUPSService: () => false
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
  const bindingSchema = {
    properties: {
      CLIENT_TYPE: {
        default: 'Foo',
        enum: ['Foo', 'Bar']
      }
    }
  };
  const service = {
    getConfiguration: () => undefined,
    getConfigurationExtAsJSON: () => [
      [
        {
          type: 'android',
          typeLabel: 'Android',
          url:
            'https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/2d76d1eb-65ef-471c-8d21-75f80c3f370f',
          id: '2d76d1eb-65ef-471c-8d21-75f80c3f370f'
        }
      ]
    ],
    getDocumentationUrl: () => undefined,
    getBindingName: () => 'test-ups-r66b9',
    getIconClass: () => 'fa fa-something',
    getId: () => 'UPS',
    getLogoUrl: () => undefined,
    getName: () => 'UPS',
    isUPSService: () => true,
    isBindingOperationInProgress: () => false,
    isBindingOperationFailed: () => false,
    getBindingSchema: () => bindingSchema,
    getFormDefinition: () => undefined,
    isBound: () => true
  };
  it('should render the bind button, binding status and update the bind panel platform selection', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindButton')).toHaveLength(1);
    expect(wrapper.find('BindingStatus')).toHaveLength(1);
    expect(bindingSchema.properties.CLIENT_TYPE.default).toEqual('IOS');
    expect(bindingSchema.properties.CLIENT_TYPE.enum).toEqual(['IOS']);
  });
});

describe('BoundServiceRow - UPS - 2 bindings', () => {
  const bindingSchema = {
    properties: {
      CLIENT_TYPE: {
        default: 'Foo',
        enum: ['Foo', 'Bar']
      }
    }
  };
  const service = {
    getConfiguration: () => undefined,
    getConfigurationExtAsJSON: () => [
      [
        {
          type: 'android',
          typeLabel: 'Android',
          url:
            'https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/2d76d1eb-65ef-471c-8d21-75f80c3f370f',
          id: '2d76d1eb-65ef-471c-8d21-75f80c3f370f'
        },
        {
          type: 'ios',
          typeLabel: 'iOS',
          url:
            'https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/c8d70b96-bd52-499c-845b-756089e06d36',
          id: 'c8d70b96-bd52-499c-845b-756089e06d36'
        }
      ]
    ],
    getDocumentationUrl: () => undefined,
    getBindingName: () => 'test-ups-r66b9',
    getIconClass: () => 'fa fa-something',
    getId: () => 'UPS',
    getLogoUrl: () => undefined,
    getName: () => 'UPS',
    isUPSService: () => true,
    isBindingOperationInProgress: () => false,
    isBindingOperationFailed: () => false,
    getBindingSchema: () => bindingSchema,
    getFormDefinition: () => undefined,
    isBound: () => true
  };
  it('should not render the bind button, render the binding status and not update the bind panel platform selection', () => {
    const wrapper = mount(
      <Provider store={store} key="provider">
        <BrowserRouter>
          <BoundServiceRow service={service} />
        </BrowserRouter>
      </Provider>
    );
    expect(wrapper.find('BindButton')).toHaveLength(0);
    // normally we show the binding status in the UnboundServiceRow, not in the bound one.
    // but, as there might be a binding in progress, we still need to show this status in BoundServiceRow too
    expect(wrapper.find('BindingStatus')).toHaveLength(1);
    expect(bindingSchema.properties.CLIENT_TYPE.default).toEqual('Foo');
    expect(bindingSchema.properties.CLIENT_TYPE.enum).toEqual(['Foo', 'Bar']);
  });
});
