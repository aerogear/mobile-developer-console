import { shallow } from 'enzyme';
import React from 'react';
import BindButton from './BindButton';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    buildConfig: {
      repoUrl: 'http://example.com',
      branch: 'example-branch',
      jobName: 'job-11010',
      jenkinsfilePath: 'https://jenkins.file/path'
    },
    service: {
      isBindingOperationInProgress: () => false
    },
    onClick: jest.fn()
  };

  const props = { ...defaultProps, ...propOverrides };
  const wrapper = shallow(<BindButton {...props} />);

  return {
    props,
    wrapper
  };
};

describe('Binding operation not in progress', () => {
  const { wrapper } = setup();

  it('should render component', () => {
    expect(wrapper.find('Button').contains('Bind to App')).toEqual(true);
  });
});

describe('onClick()', () => {
  const { wrapper } = setup();

  it('should press button', () => {
    const saveButton = wrapper.find('Button');

    expect(saveButton.simulate('click')).toHaveLength(1);
  });
});

describe('Binding operation in progress', () => {
  const { wrapper } = setup({ service: { isBindingOperationInProgress: () => true } });

  it('should not render component', () => {
    // this should pass when its null
    expect(wrapper.name()).toEqual(null);
    expect(wrapper.children()).toHaveLength(0);
  });
});
