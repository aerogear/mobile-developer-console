import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
Enzyme.configure({ adapter: new Adapter() });

import CopyToClipboard from './CopyToClipboardMultiline';

describe('CopyToClipboard', () => {
  it('test render', () => {
    const wrapper = shallow(<CopyToClipboard className="test" />);
    expect(wrapper.find('div.test')).toHaveLength(1);
    expect(wrapper.find('CopyToClipboard')).toBeDefined();
    expect(wrapper.find('OverlayTrigger')).toBeDefined();
  });
});