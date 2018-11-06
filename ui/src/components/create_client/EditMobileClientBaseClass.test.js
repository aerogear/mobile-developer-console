import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import CreateIOSClient, { LABEL_APPID as IOS_LABEL_APPID, EXAMPLE_APPID as IOS_EXAMPLE_APPID } from './CreateIOSClient';
import CreateAndroidClient, { EXAMPLE_APPIDENTIFIER as ANDROID_EXAMPLE_APPID } from './CreateAndroidClient';
import CreateCordovaClient, { EXAMPLE_APPIDENTIFIER as CORDOVA_EXAMPLE_APPID } from './CreateCordovaClient';
import CreateXamarinClient, { EXAMPLE_APPIDENTIFIER as XAMARIN_EXAMPLE_APPID } from './CreateXamarinClient';
import {
  LABEL_APPNAME,
  EXAMPLE_APPNAME,
  LABEL_APPIDENTIFIER,
} from './EditMobileClientBaseClass';
import configureStore from '../../configureStore';

Enzyme.configure({ adapter: new Adapter() });

const store = configureStore();

describe('CreateIOSClient', () => {
  it('test create render', () => {
    const wrapper = shallow(<CreateIOSClient store={store} />).dive();
    const rendered = wrapper.render();
    const appIdentifier = rendered.find('[id="appIdentifier"]');
    const appName = rendered.find('[id="name"]');

    expect(rendered.find('label')).toHaveLength(2);
    expect(rendered.find('[for="appIdentifier"]').text()).toEqual(IOS_LABEL_APPID);
    expect(rendered.find('[for="name"]').text()).toEqual(LABEL_APPNAME);
    expect(appName.attr('placeholder')).toEqual(EXAMPLE_APPNAME);
    expect(appIdentifier.attr('placeholder')).toEqual(IOS_EXAMPLE_APPID);
  });
});

describe('CreateAndroid', () => {
  it('test create render', () => {
    const wrapper = shallow(<CreateAndroidClient store={store} />).dive();
    const rendered = wrapper.render();
    const appName = rendered.find('[id="name"]');
    const appIdentifier = rendered.find('[id="appIdentifier"]');

    expect(rendered.find('label')).toHaveLength(2);
    expect(rendered.find('[for="appIdentifier"]').text()).toEqual(LABEL_APPIDENTIFIER);
    expect(rendered.find('[for="name"]').text()).toEqual(LABEL_APPNAME);
    expect(appName.attr('placeholder')).toEqual(EXAMPLE_APPNAME);
    expect(appIdentifier.attr('placeholder')).toEqual(ANDROID_EXAMPLE_APPID);
  });
});

describe('CreateCordova', () => {
  it('test create render', () => {
    const wrapper = shallow(<CreateCordovaClient store={store} />).dive();
    const rendered = wrapper.render();
    const appName = rendered.find('[id="name"]');
    const appIdentifier = rendered.find('[id="appIdentifier"]');

    expect(rendered.find('label')).toHaveLength(2);
    expect(rendered.find('[for="appIdentifier"]').text()).toEqual(LABEL_APPIDENTIFIER);
    expect(rendered.find('[for="name"]').text()).toEqual(LABEL_APPNAME);
    expect(appName.attr('placeholder')).toEqual(EXAMPLE_APPNAME);
    expect(appIdentifier.attr('placeholder')).toEqual(CORDOVA_EXAMPLE_APPID);
  });
});

describe('CreateXamarin', () => {
  it('test create render', () => {
    const wrapper = shallow(<CreateXamarinClient store={store} />).dive();
    const rendered = wrapper.render();
    const appName = rendered.find('[id="name"]');
    const appIdentifier = rendered.find('[id="appIdentifier"]');

    expect(rendered.find('label')).toHaveLength(2);
    expect(rendered.find('[for="appIdentifier"]').text()).toEqual(LABEL_APPIDENTIFIER);
    expect(rendered.find('[for="name"]').text()).toEqual(LABEL_APPNAME);
    expect(appName.attr('placeholder')).toEqual(EXAMPLE_APPNAME);
    expect(appIdentifier.attr('placeholder')).toEqual(XAMARIN_EXAMPLE_APPID);
  });
});
