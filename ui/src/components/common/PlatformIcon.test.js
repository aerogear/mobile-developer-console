import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
Enzyme.configure({ adapter: new Adapter() });

import PlatformIcon from './PlatformIcon';

describe('PlatformIcon', () => {
  it('test render', () => {
    const iconsMapping = {
      'android': 'Android',
      'cordova': 'Cordova',
      'iOS': 'iOS',
      'xamarin': 'Xamarin'
    };
    for (var key in iconsMapping) {
      const wrapper = shallow(<PlatformIcon platform={key} />);
      expect(wrapper.find({'alt': iconsMapping[key]})).toHaveLength(1);
    }
  });
});