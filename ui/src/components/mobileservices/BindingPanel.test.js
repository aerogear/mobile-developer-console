/* eslint guard-for-in: 0 */

import { shallow } from 'enzyme';
import React from 'react';
import { BindingPanel } from './BindingPanel';
import { wrap } from 'module';

describe('BindingPanel', () => {
  const service = {
    getName: () => 'Data Sync',
    getBindingSchema: () => 'http://json-schema.org/draft-04/schema',
    getFormDefinition: () => 'CLIENT_ID',
    isUPSService: () => false
  };
  it('should render the Wizard for binding the service', () => {
    const wrapper = shallow(<BindingPanel service={service} />);
    console.log(wrapper.debug());
    
    expect(wrapper.find('WizardPattern')).toHaveLength(1);
  });
});
