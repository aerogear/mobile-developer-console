import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import ComponentSectionLabel from './ComponentSectionLabel';

Enzyme.configure({ adapter: new Adapter() });

describe('ComponentSectionLabel', () => {
  it('test render', () => {
    const wrapper = shallow(<ComponentSectionLabel />);
    expect(wrapper.find('div.component-label')).toHaveLength(1);
  });
});
