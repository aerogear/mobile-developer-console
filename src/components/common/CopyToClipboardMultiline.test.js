import { shallow } from 'enzyme';
import React from 'react';
import { CopyToClipboardMultiline } from './CopyToClipboardMultiline';

describe(CopyToClipboardMultiline, () => {
  it('test render', () => {
    const wrapper = shallow(<CopyToClipboardMultiline className="test" />);
    expect(wrapper.find('div.test')).toHaveLength(1);
    expect(wrapper.find('CopyToClipboard')).toBeDefined();
    expect(wrapper.find('OverlayTrigger')).toBeDefined();
  });
});
