import { shallow } from 'enzyme';
import React from 'react';
import configureStore from '../../configureStore';
import ConfigurationView from './ConfigurationView';
import { MobileApp } from '../../models';
import frameworks from './sdk-config-docs/frameworks';

const store = configureStore();

describe('ConfigurationView', () => {
  it('test render proper count of FrameworkSDKDocs', () => {
    const app = new MobileApp();
    const wrapper = shallow(<ConfigurationView store={store} app={app} />).dive();
    expect(wrapper.find('FrameworkSDKDocs')).toHaveLength(Object.keys(frameworks).length);
  });
});
