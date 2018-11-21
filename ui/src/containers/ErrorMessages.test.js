import { mount } from 'enzyme';
import React from 'react';
import { ErrorMessages } from './ErrorMessages';

describe('ErrorMessages', () => {
  it('test render', () => {
    const errors = [{ error: { message: 'error1' } }, { error: { message: 'error2' } }];

    const history = {
      listen: () => {}
    };
    const wrapper = mount(<ErrorMessages errors={errors} history={history} />);
    expect(wrapper.find('.alert.toast-pf')).toHaveLength(2);
    expect(
      wrapper
        .find('div.toast-notifications-list-pf')
        .childAt(0)
        .text()
    ).toEqual('error1');
    expect(
      wrapper
        .find('div.toast-notifications-list-pf')
        .childAt(1)
        .text()
    ).toEqual('error2');
  });
});
