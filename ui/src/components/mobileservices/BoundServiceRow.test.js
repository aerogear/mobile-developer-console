/* eslint guard-for-in: 0 */

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import BoundServiceRow from './BoundServiceRow';

Enzyme.configure({ adapter: new Adapter() });
describe('BoundServiceRow', () => {
  const service = {
    getConfiguration: () => undefined,
    getDocumentationUrl: () => undefined,
    getBindingName: () => 'test-data-sync-r66b9',
    getIconClass: () => 'fa fa-refresh',
    getId: () => 'Data Sync',
    getLogoUrl: () => undefined,
    getName: () => 'Data Sync'
  };
  it('should render the row with bound service', () => {
    const wrapper = shallow(<BoundServiceRow service={service} />);
    expect(wrapper.find('ListViewItem')).toHaveLength(1);
  });

  it('should display documentation URL in the service row', () => {
    service.getDocumentationUrl = () => 'http://test-url.com';
    const wrapper = shallow(<BoundServiceRow service={service} />);
    expect(wrapper.find(`a[href="${service.getDocumentationUrl()}"]`).text()).toEqual('SDK Setup');
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
});
