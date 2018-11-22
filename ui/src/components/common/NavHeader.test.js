import { shallow } from 'enzyme';
import React from 'react';
import { _NavHeader as NavHeader } from './NavHeader';

describe('NavHeader', () => {
  it('test render', () => {
    const title = 'test';
    const user = { name: 'testuser' };
    const helpDropdownItems = [{ text: 'testhelp' }];
    const userDropdownItems = [{ text: 'userdropdown' }];
    const wrapper = shallow(
      <NavHeader
        user={user}
        title={title}
        helpDropdownItems={helpDropdownItems}
        userDropdownItems={userDropdownItems}
      />
    );
    expect(wrapper.find('Masthead')).toHaveLength(1);
    expect(wrapper.find('Masthead').prop('title')).toEqual(title);
    expect(wrapper.find('MastheadDropdown')).toHaveLength(2);
    expect(
      wrapper
        .find('MastheadDropdown')
        .first()
        .find('MenuItem')
    ).toHaveLength(1);
    expect(
      wrapper
        .find('MastheadDropdown')
        .last()
        .find('MenuItem')
    ).toHaveLength(1);
  });
});
