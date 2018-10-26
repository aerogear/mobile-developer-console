import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
Enzyme.configure({ adapter: new Adapter() });

import MobileListViewItem from "./MobileListViewItem";

describe('MobileListViewItem', () => {
  it('test render', () => {
    const wrapper = shallow(<MobileListViewItem className="test" />);
    expect(wrapper.find('ListViewItem')).toHaveLength(1);
  });
});
