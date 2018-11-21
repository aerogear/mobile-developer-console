import { shallow } from 'enzyme';
import React from 'react';

import ComponentSectionLabel from './ComponentSectionLabel';

describe('ComponentSectionLabel', () => {
  it('test render', () => {
    const wrapper = shallow(<ComponentSectionLabel />);
    expect(wrapper.find('div.component-label')).toHaveLength(1);
  });
});
