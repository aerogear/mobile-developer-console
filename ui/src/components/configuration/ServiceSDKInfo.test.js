import { shallow } from 'enzyme';
import React from 'react';
import { MobileApp } from '../../models';
import { appJSON, framework } from './sdk-config-docs/sdkdocs-test-data';
import ServiceSDKInfo from './ServiceSDKInfo';

describe('ServiceSDKInfo', () => {
  it('test render', () => {
    const app = new MobileApp(appJSON);
    const VERSION = 'testversion';
    const frameworkDocs = framework(VERSION);
    const services = app.getStatus().getServices();
    const wrapper = shallow(<ServiceSDKInfo mobileApp={app} framework={frameworkDocs} />);
    services.forEach(({ type }) => {
      const { serviceLogoUrl, serviceName, setupText, docsLink } = frameworkDocs.services[type];
      expect(wrapper.find('img').map(node => node.prop('src'))).toContain(serviceLogoUrl);
      expect(wrapper.find('.service-name > h4 > div').map(node => node.text())).toContain(serviceName);
      expect(wrapper.find('.service-details > h5 > a').map(node => node.prop('href'))).toContain(docsLink);
      expect(wrapper.find('.service-details > h5 > a').map(node => node.text())).toContain(setupText);
    });
  });
});
