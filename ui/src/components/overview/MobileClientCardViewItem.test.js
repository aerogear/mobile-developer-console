import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import MobileClientCardViewItem from './MobileClientCardViewItem';

Enzyme.configure({ adapter: new Adapter() });

describe('MobileClientCardViewItem', () => {
  it('test render', () => {
    const app = {
      metadata: {
        name: 'test'
      },
      spec: {
        cleintType: 'android'
      }
    };
    const services = [{ type: 'metrics' }, { type: 'keycloak' }, { type: 'push' }, { type: 'sync' }];
    const buildTabEnabled = true;
    const builds = { numFailedBuilds: 1, numInProgressBuilds: 1 };
    const wrapper = shallow(
      <MobileClientCardViewItem app={app} services={services} buildTabEnabled={buildTabEnabled} builds={builds} />
    );
    expect(wrapper.find('DropdownKebab')).toHaveLength(1);
    expect(wrapper.find('span.pficon-error-circle-o')).toHaveLength(1);
    expect(wrapper.find('span.fa-refresh')).toHaveLength(1);
    expect(wrapper.find('PlatformIcon')).toHaveLength(1);
    expect(wrapper.find('img.icon')).toHaveLength(4);
  });
});
