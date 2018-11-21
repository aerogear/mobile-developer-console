/* eslint guard-for-in: 0 */

import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { BindingPanel } from './BindingPanel';

Enzyme.configure({ adapter: new Adapter() });
describe('BindingPanel', () => {
  const service = {
    getName: () => 'Data Sync',
    getBindingSchema: () => 'http://json-schema.org/draft-04/schema',
    getFormDefinition: () => 'CLIENT_ID'
  };
  it('should render the Wizard for binding the service', () => {
    const wrapper = shallow(<BindingPanel service={service} />);
    expect(wrapper.find('WizardPattern')).toHaveLength(1);
  });
});
