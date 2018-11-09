import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import NavHeader from './NavHeader';

Enzyme.configure({ adapter: new Adapter() });

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
