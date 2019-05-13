import { shallow } from 'enzyme';
import React from 'react';

import MobileListViewItem from './MobileListViewItem';

describe('MobileListViewItem', () => {
  it('test render', () => {
    const wrapper = shallow(<MobileListViewItem className="test" />);
    expect(wrapper.find('ListViewItem')).toHaveLength(1);
  });
});
