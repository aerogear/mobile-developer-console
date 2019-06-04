import { shallow } from 'enzyme';
import React from 'react';
import BuildConfigDetails from './BuildConfigDetails';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    buildConfig: {
      repoUrl: 'http://example.com',
      branch: 'example-branch',
      jobName: 'job-11010',
      jenkinsfilePath: 'https://jenkins.file/path'
    }
  };

  const props = { ...defaultProps, propOverrides };
  const wrapper = shallow(<BuildConfigDetails {...props} />);

  return {
    props,
    wrapper
  };
};

describe('BuildConfigDetails', () => {
  const {
    props: {
      buildConfig: { repoUrl, branch, jobName, jenkinsfilePath }
    },
    wrapper
  } = setup();

  it('should render component', () => {
    expect(wrapper).toHaveLength(1);
    expect(wrapper.find('Row')).toHaveLength(2);

    describe('First Row', () => {
      const firstRow = wrapper.childAt(0);

      expect(firstRow.name()).toEqual('Row');

      expect(firstRow.find('Col')).toHaveLength(2);

      expect(
        firstRow
          .childAt(0)
          .find('a')
          .props().href
      ).toEqual(repoUrl);

      expect(
        firstRow
          .childAt(0)
          .find('a')
          .text()
      ).toEqual(repoUrl);

      expect(
        firstRow
          .childAt(1)
          .find('span')
          .text()
      ).toEqual(branch);
    });
  });

  describe('Second Row', () => {
    const secondRow = wrapper.childAt(1);

    expect(secondRow.name()).toEqual('Row');

    expect(
      secondRow
        .childAt(0)
        .find('span')
        .text()
    ).toEqual(jobName);

    expect(
      secondRow
        .childAt(1)
        .find('span')
        .text()
    ).toEqual(jenkinsfilePath);
  });
});
