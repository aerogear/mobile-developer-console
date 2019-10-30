/* eslint guard-for-in: 0 */

import { shallow } from 'enzyme';
import React from 'react';
import { BindingPanel } from './BindingPanel';

/* TODO: Test needs update to work with latest PF4 changes */

xdescribe('BindingPanel', () => {
  const service = {
    getName: () => 'Data Sync',
    getBindingForm: () => ({
      schema: {
        type: 'object',
        properties: {
          test: {
            type: 'string'
          }
        }
      }
    }),
    isUPSService: () => false
  };
  it('should render the Wizard for binding the service', () => {
    const wrapper = shallow(<BindingPanel service={service} />);
    expect(wrapper.find('WizardPattern')).toHaveLength(1);
  });
});
