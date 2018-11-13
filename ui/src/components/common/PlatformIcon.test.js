/* eslint guard-for-in: 0 */

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import PlatformIcon from './PlatformIcon';

Enzyme.configure({ adapter: new Adapter() });

describe('PlatformIcon', () => {
  it('test render', () => {
    const iconsMapping = {
      android: 'Android',
      cordova: 'Cordova',
      iOS: 'iOS',
      xamarin: 'Xamarin'
    };
    for (const key in iconsMapping) {
      const wrapper = shallow(<PlatformIcon platform={key} />);
      expect(wrapper.find({ alt: iconsMapping[key] })).toHaveLength(1);
    }
  });
});
