import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import Header from './Header';

Enzyme.configure({ adapter: new Adapter() });

describe('Header', () => {
  it('test render', () => {
    const wrapper = shallow(
      <Header className="test-header">
        <span>test</span>
      </Header>
    );
    expect(wrapper.find('span')).toHaveLength(1);
    expect(wrapper.find('.test-header')).toHaveLength(1);
  });
});
