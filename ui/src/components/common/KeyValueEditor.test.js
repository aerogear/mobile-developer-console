import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
Enzyme.configure({ adapter: new Adapter() });

import KeyValueEditor from './KeyValueEditor';

describe('KeyValueEditor', () => {
  it('test render', () => {
    const wrapper = shallow(<KeyValueEditor />);
    expect(wrapper.find('.btn-add')).toHaveLength(1);
    expect(wrapper.find('Row')).toHaveLength(2);
  });

  it('test add and delete', () => {
    const wrapper = shallow(<KeyValueEditor />);
    wrapper.find({placeholder:'Key'}).simulate('change', {target: {value: 'testKey'}});
    wrapper.find({placeholder:'Value'}).simulate('change', {target: {value: 'testValue'}});
    wrapper.find('.btn-add').simulate('click');
    expect(wrapper.find('Row')).toHaveLength(3);
    wrapper.find('button').first().simulate('click', {preventDefault:()=>{}});
    expect(wrapper.find('Row')).toHaveLength(2);
  });
});