import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { CopyToClipboardMultiline } from './CopyToClipboardMultiline';

Enzyme.configure({ adapter: new Adapter() });

describe(CopyToClipboardMultiline, () => {
  it('test render', () => {
    const wrapper = shallow(<CopyToClipboardMultiline className="test" />);
    expect(wrapper.find('div.test')).toHaveLength(1);
    expect(wrapper.find('CopyToClipboard')).toBeDefined();
    expect(wrapper.find('OverlayTrigger')).toBeDefined();
  });
});
