import { shallow } from 'enzyme';
import React from 'react';

import MobileClientCardView from './MobileClientCardView';

describe('MobileClientCardView', () => {
  it('test filter by app name', () => {
    const wrapper = shallow(<MobileClientCardView mobileClients={[]}  />);
    expect(wrapper.find('EmptyState')).toHaveLength(1);
  });

  it('test render apps', () => {
    const apps = [
      {
        metadata: {
          name: 'my-app'
        },
        status: {
          services: []
        }
      },
      {
        metadata: {
          name: 'your-app'
        },
        status: {
          services: []
        }
      }
    ];
    const wrapper = shallow(<MobileClientCardView mobileClients={apps} mobileClientBuilds={[]} />);
    expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(2);
    wrapper.find('DebounceInput').simulate('change', { target: { value: 'your' } });
    expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(1);
  });
});
