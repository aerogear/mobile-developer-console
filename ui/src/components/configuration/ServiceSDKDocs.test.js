import { shallow } from 'enzyme';
import React from 'react';
import { MobileApp } from '../../models';
import { appJSON, framework } from './sdk-config-docs/sdkdocs-test-data';
import { ServiceSDKDocs } from './ServiceSDKDocs';
import { ServiceSDKSetup } from './ServiceSDKSetup';

describe('ServiceSDKDocs', () => {
  it('test render', () => {
    const app = new MobileApp(appJSON);
    const VERSION = 'testversion';
    const frameworkDocs = framework(VERSION);
    const services = app.getStatus().getServices();
    const wrapper = shallow(<ServiceSDKDocs mobileApp={app} framework={frameworkDocs} />);
    for (let i = 0; i < frameworkDocs.steps.length; i++) {
      expect(
        wrapper
          .find(ServiceSDKSetup)
          .at(i)
          .prop('docs')
      ).toEqual(frameworkDocs.steps[i]);
    }
    services.forEach(({ type }) => {
      for (let i = 0; frameworkDocs.services[type] && i < frameworkDocs.services[type].steps.length; i++) {
        expect(wrapper.find(ServiceSDKSetup).map(node => node.prop('docs'))).toContain(
          frameworkDocs.services[type].steps[i]
        );
      }
    });
  });
});
