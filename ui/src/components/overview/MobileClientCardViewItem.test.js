import { shallow } from 'enzyme';
import React from 'react';

import MobileClientCardViewItem from './MobileClientCardViewItem';

describe('MobileClientCardViewItem', () => {
  it('test render', () => {
    const app = {
      metadata: {
        name: 'test'
      },
      spec: {}
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
    expect(wrapper.find('img.icon')).toHaveLength(4);
  });
});
