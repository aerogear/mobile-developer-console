/* eslint guard-for-in: 0 */

import { shallow } from 'enzyme';
import React from 'react';
import { BindingPanel } from './BindingPanel';

describe('BindingPanel', () => {
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
    expect(wrapper.find('Wizard')).toHaveLength(1);
  });
});
