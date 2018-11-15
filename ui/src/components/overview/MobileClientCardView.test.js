import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import MobileClientCardView from './MobileClientCardView';

Enzyme.configure({ adapter: new Adapter() });

describe('MobileClientCardView', () => {
    it('test filter by app name', () => {
        const wrapper = shallow(<MobileClientCardView mobileClients={[]} />);
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
    wrapper.find('FormControl').simulate('change', { target: { value: 'your' } });
    const e = {
      key: 'Enter',
      stopPropagation: () => {},
      preventDefault: () => {}
    };
    wrapper.find('FormControl').simulate('keyPress', e);
    expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(1);
  });
});
