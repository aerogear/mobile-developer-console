import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MobileClientConfig } from './MobileClientConfig';
import { CopyToClipboardMultiline } from './CopyToClipboardMultiline';

Enzyme.configure({ adapter: new Adapter() });

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
