import { shallow } from 'enzyme';
import React from 'react';

import Header from './Header';

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
