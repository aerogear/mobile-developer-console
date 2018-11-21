import { shallow } from 'enzyme';
import React from 'react';

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
      apps: { items: [] },
      services: { items: [] },
      builds: { items: [] }
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
