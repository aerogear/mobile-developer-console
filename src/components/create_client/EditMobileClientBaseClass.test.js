import { shallow } from 'enzyme';
import React from 'react';
import CreateClient from './CreateClient';
import { LABEL_APPNAME, EXAMPLE_APPNAME } from './EditMobileClientBaseClass';
import configureStore from '../../configureStore';

const store = configureStore();

describe('Create', () => {
  it('test create render', () => {
    const wrapper = shallow(<CreateClient store={store} />).dive();
    const rendered = wrapper.render();
    const appName = rendered.find('[id="name"]');

    expect(rendered.find('label')).toHaveLength(1);
    expect(rendered.find('[for="name"]').text()).toEqual(LABEL_APPNAME);
    expect(appName.attr('placeholder')).toEqual(EXAMPLE_APPNAME);
  });
});
