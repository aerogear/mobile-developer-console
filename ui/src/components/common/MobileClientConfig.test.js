import React from 'react';
import { shallow } from 'enzyme';
import { MobileClientConfig } from './MobileClientConfig';
import { CopyToClipboardMultiline } from './CopyToClipboardMultiline';

describe(MobileClientConfig, () => {
  it('test render', () => {
    const config = {
      status: {
        services: [
          {
            type: 'test'
          }
        ]
      }
    };

    const wrapper = shallow(<MobileClientConfig mobileClient={config} />);
    expect(wrapper.find(CopyToClipboardMultiline)).toHaveLength(1);
    expect(
      JSON.parse(
        wrapper
          .find(CopyToClipboardMultiline)
          .childAt(0)
          .text()
      )
    ).toEqual(config.status);
  });
});
