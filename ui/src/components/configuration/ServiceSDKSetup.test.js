import { shallow } from 'enzyme';
import React from 'react';
import { framework } from './sdk-config-docs/sdkdocs-test-data';
import { ServiceSDKSetup } from './ServiceSDKSetup';

describe('ServiceSDKSetup', () => {
  it('test render', () => {
    const VERSION = 'testversion';
    const docs = framework(VERSION).steps[0];
    const wrapper = shallow(<ServiceSDKSetup docs={docs} />);
    expect(wrapper.find('li > h4 > ReactMarkdown').prop('source')).toEqual(docs.introduction);
    let i = 0;
    docs.commands.forEach(command => {
      expect(
        wrapper
          .find('li > ul > li > ReactMarkdown')
          .at(i)
          .prop('source')
      ).toEqual(typeof command === 'string' ? command : `${command[0]}\n\n${command[1]}`);
      i++;
    });
  });
});
