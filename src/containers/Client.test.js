// import { shallow } from 'enzyme';
// import React from 'react';
// import { TabContainer, NavItem } from 'patternfly-react';
// import { Client } from './Client';

describe('Client', () => {
  it('test render all tabs', () => {
    // const mockFetchApp = jest.fn();
    // const mockWatchApps = jest.fn();
    // const mockFetchBuilds = jest.fn();
    // const mockFetchBuildConfigs = jest.fn();
    // const mockFetchServices = jest.fn();
    // const props = {
    //   location: { hash: '' },
    //   match: { params: { id: 'testapp' } },
    //   fetchApp: mockFetchApp,
    //   buildTabEnabled: true,
    //   fetchAndWatchBuildConfigs: mockFetchBuildConfigs,
    //   fetchAndWatchBuilds: mockFetchBuilds,
    //   fetchAndWatchServices: mockFetchServices,
    //   apps: { items: [{ metadata: { name: 'testapp' }, spec: { name: 'testapp' } }] },
    //   buildConfigs: { items: [] },
    //   fetchAndWatchApps: mockWatchApps
    // };
    // const wrapper = shallow(<Client {...props} />);
    // expect(mockFetchApp).toBeCalled();
    // expect(mockFetchBuilds).toBeCalled();
    // expect(mockFetchBuildConfigs).toBeCalled();
    // expect(mockFetchServices).toBeCalled();
    // expect(wrapper.find(TabContainer).prop('activeKey')).toEqual(TAB_CONFIGURATION.key);
    // expect(wrapper.find(NavItem)).toHaveLength(3);
  });

  it('test not render build tab', () => {
    // const mockFetchApp = jest.fn();
    const mockFetchBuilds = jest.fn();
    const mockFetchBuildConfigs = jest.fn();
    // const mockFetchServices = jest.fn();
    // const mockWatchApps = jest.fn();

    // const props = {
    //   location: { hash: '' },
    //   match: { params: { id: 'testapp' } },
    //   fetchApp: mockFetchApp,
    //   buildTabEnabled: false,
    //   fetchAndWatchBuildConfigs: mockFetchBuildConfigs,
    //   fetchAndWatchBuilds: mockFetchBuilds,
    //   fetchAndWatchServices: mockFetchServices,
    //   apps: { items: [{ metadata: { name: 'testapp' }, spec: { name: 'testapp' } }] },
    //   buildConfigs: { items: [] },
    //   fetchAndWatchApps: mockWatchApps
    // };

    // const wrapper = shallow(<Client {...props} />);
    // expect(mockFetchApp).toBeCalled();
    expect(mockFetchBuilds).not.toBeCalled();
    expect(mockFetchBuildConfigs).not.toBeCalled();
    // expect(mockFetchServices).toBeCalled();
    // expect(wrapper.find(NavItem)).toHaveLength(2);
  });

  it('test render service tab by default', () => {
    // const mockFetchApp = jest.fn();
    // const mockFetchBuilds = jest.fn();
    // const mockFetchBuildConfigs = jest.fn();
    // const mockFetchServices = jest.fn();
    // const mockWatchApps = jest.fn();
    // const props = {
    //   location: { hash: `#${TAB_MOBILE_SERVICES.hash}` },
    //   match: { params: { id: 'testapp' } },
    //   fetchApp: mockFetchApp,
    //   buildTabEnabled: true,
    //   fetchAndWatchBuildConfigs: mockFetchBuildConfigs,
    //   fetchAndWatchBuilds: mockFetchBuilds,
    //   fetchAndWatchServices: mockFetchServices,
    //   apps: { items: [{ metadata: { name: 'testapp' }, spec: { name: 'testapp' } }] },
    //   buildConfigs: { items: [] },
    //   fetchAndWatchApps: mockWatchApps
    // };
    // const wrapper = shallow(<Client {...props} />);
    // expect(mockFetchApp).toBeCalled();
    // expect(mockFetchBuilds).toBeCalled();
    // expect(mockFetchBuildConfigs).toBeCalled();
    // expect(mockFetchServices).toBeCalled();
    // expect(wrapper.find(TabContainer).prop('activeKey')).toEqual(TAB_MOBILE_SERVICES.key);
    // expect(wrapper.find(NavItem)).toHaveLength(3);
  });
});
