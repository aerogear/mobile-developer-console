import { shallow } from 'enzyme';
import React from 'react';
import { Overview } from './Overview';

describe('Overview', () => {
  it('test render', () => {
    const mockFetchApps = jest.fn();
    const mockFetchBuilds = jest.fn();

    const props = {
      fetchAndWatchApps: mockFetchApps,
      fetchAndWatchBuilds: mockFetchBuilds,
      buildTabEnabled: true,
      apps: { items: [] },
      services: { items: [] },
      builds: { items: [] }
    };

    const wrapper = shallow(<Overview {...props} />);
    expect(mockFetchApps).toBeCalled();
    expect(mockFetchBuilds).toBeCalled();
    expect(wrapper.find('MobileClientCardView')).toHaveLength(1);
  });
});
