import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
Enzyme.configure({ adapter: new Adapter() });

import Header from './Header';

describe('Header', () => {
  it('test render', () => {
    const wrapper = shallow(<Header className="test-header"><span>test</span></Header>);
    expect(wrapper.find('span')).toHaveLength(1);
    expect(wrapper.find('.test-header')).toHaveLength(1);
  });
});