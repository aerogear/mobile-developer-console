/* eslint guard-for-in: 0 */

import { shallow } from 'enzyme';
import React from 'react';
import { OpenShiftObjectTemplate } from './bindingPanelUtils';

describe('BindingPanelUtils', () => {
  const title = 'test_title';
  const rootClientId = 'root_CLIENT_ID';

  const props = {
    title,
    TitleField: 'h1',
    uiSchema: { form: ['CLIENT_ID'] },
    schema: { properties: { CLIENT_ID: { title } } },
    properties: [{ name: 'CLIENT_ID', content: { key: 'CLIENT_ID' } }],
    idSchema: { CLIENT_ID: { $id: rootClientId } }
  };

  it('should render util component for binding the service with CLIENT_ID', () => {
    const wrapper = shallow(<OpenShiftObjectTemplate {...props} />);
    expect(wrapper.find(`label[htmlFor="${rootClientId}"]`)).toHaveLength(1);
    expect(wrapper.find(`label[htmlFor="${rootClientId}"]`).text()).toEqual(title);
    expect(wrapper.find(`input[id="${rootClientId}"]`)).toHaveLength(1);
  });

  it('should render util component for binding the service with CLIENT_TYPE', () => {
    const propsClientType = {
      ...props,
      uiSchema: { form: ['CLIENT_TYPE'] },
      schema: { properties: { CLIENT_TYPE: { title, enum: ['Android'] } } },
      properties: [{ name: 'CLIENT_TYPE', content: { key: 'CLIENT_TYPE' } }],
      idSchema: { CLIENT_TYPE: { $id: rootClientId } }
    };

    const wrapper = shallow(<OpenShiftObjectTemplate {...propsClientType} />);
    expect(wrapper.find(`label[htmlFor="${rootClientId}"]`)).toHaveLength(1);
    expect(wrapper.find(`label[htmlFor="${rootClientId}"]`).text()).toEqual(title);
    expect(wrapper.find(`select[id="${rootClientId}"]`)).toHaveLength(1);
  });

  it('should render util component for binding the service with fieldset', () => {
    const rootPassphraseId = 'root_passphrase';
    const propsFieldSet = {
      ...props,
      uiSchema: { form: [{ items: [{ key: 'passphrase', type: 'password' }], title }] },
      schema: { properties: { passphrase: { title } } },
      properties: [{ name: 'passphrase', content: { key: 'CLIENT_TYPE' } }],
      idSchema: { passphrase: { $id: rootPassphraseId } }
    };
    const wrapper = shallow(<OpenShiftObjectTemplate {...propsFieldSet} />);
    expect(wrapper.find(`label[htmlFor="${rootPassphraseId}"]`)).toHaveLength(1);
    expect(wrapper.find(`label[htmlFor="${rootPassphraseId}"]`).text()).toEqual(title);
    expect(wrapper.find(`input[id="${rootPassphraseId}"]`)).toHaveLength(1);
    expect(wrapper.find('h2').text()).toEqual(title);
  });
});
