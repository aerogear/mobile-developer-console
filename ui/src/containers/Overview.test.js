import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
Enzyme.configure({ adapter: new Adapter() });

import DataService from '../DataService';
import { Overview } from './Overview';

jest.mock('../DataService');

describe('Overview', () => {
  it('test render', () => {
    const mockFetchApps = jest.fn();
    const mockFetchServices = jest.fn();
    const mockFetchBuilds = jest.fn();

    const props = {
      fetchApps: mockFetchApps,
      fetchServices: mockFetchServices,
      fetchBuilds: mockFetchBuilds,
      buildTabEnabled: true,
      apps: {items: []},
      services: {items: []},
      builds: {items: []}
    };

    const wrapper = shallow(<Overview {...props} />);
    expect(mockFetchApps).toBeCalled();
    expect(mockFetchServices).toBeCalled();
    expect(mockFetchBuilds).toBeCalled();
    expect(DataService.watchApps).toBeCalled();
    expect(DataService.watchServices).toBeCalled();
    expect(wrapper.find('MobileClientCardView')).toHaveLength(1);
  });
});