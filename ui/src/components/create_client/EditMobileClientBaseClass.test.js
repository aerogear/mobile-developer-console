import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import CreateClient, { EXAMPLE_APPIDENTIFIER } from './CreateClient';
import { LABEL_APPNAME, EXAMPLE_APPNAME, LABEL_APPIDENTIFIER } from './EditMobileClientBaseClass';
import configureStore from '../../configureStore';

Enzyme.configure({ adapter: new Adapter() });

const store = configureStore();

describe('Create', () => {
  it('test create render', () => {
    const wrapper = shallow(<CreateClient store={store} />).dive();
    const rendered = wrapper.render();
    const appName = rendered.find('[id="name"]');
    const appIdentifier = rendered.find('[id="appIdentifier"]');

    expect(rendered.find('label')).toHaveLength(2);
    expect(rendered.find('[for="appIdentifier"]').text()).toEqual(LABEL_APPIDENTIFIER);
    expect(rendered.find('[for="name"]').text()).toEqual(LABEL_APPNAME);
    expect(appName.attr('placeholder')).toEqual(EXAMPLE_APPNAME);
    expect(appIdentifier.attr('placeholder')).toEqual(EXAMPLE_APPIDENTIFIER);
  });
});
