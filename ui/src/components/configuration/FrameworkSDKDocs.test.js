import { shallow } from 'enzyme';
import React from 'react';
import { clone } from 'lodash-es';
import { MobileApp } from '../../models';
import { appJSON, framework } from './sdk-config-docs/sdkdocs-test-data';
import FrameworkSDKDocs from './FrameworkSDKDocs';

describe('FrameworkSDKDocs', () => {
  it('test render', () => {
    const app = new MobileApp(appJSON);
    const wrapper = shallow(<FrameworkSDKDocs mobileApp={app} framework={framework} />);
    expect(wrapper.find('Header')).toHaveLength(1);
    expect(wrapper.find('ServiceSDKDocs')).toHaveLength(1);
    expect(wrapper.find('ServiceSDKInfo')).toHaveLength(1);
  });
  it('test render no services', () => {
    const json2 = clone(appJSON);
    json2.status.services = [];
    const app = new MobileApp(json2);
    const wrapper = shallow(<FrameworkSDKDocs mobileApp={app} framework={framework} />);
    expect(wrapper.find('Header')).toHaveLength(1);
    expect(wrapper.find('ServiceSDKDocs')).toHaveLength(1);
    expect(wrapper.find('ServiceSDKInfo')).toHaveLength(0);
  });
});
