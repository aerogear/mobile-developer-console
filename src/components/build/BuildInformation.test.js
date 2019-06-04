import React from 'react';
import { shallow } from 'enzyme';
import BuildInformation from './BuildInformation';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    build: {},
    appName: ''
  };

  const props = { ...defaultProps, propOverrides };
  const wrapper = shallow(<BuildInformation {...props} />);

  return { props, wrapper };
};

describe('BuildInformation', () => {
  const {
    props: { build },
    wrapper
  } = setup({
    appName: 'myapp',
    build: {
      buildUrl: 'http://build.url',
      metadata: {
        annotations: {
          name: 'myapp',
          'aerogear.org/download-mobile-artifact': 'hello-world',
          'aerogear.org/download-mobile-artifact-url': 'http://download.url',
          'openshift.io/build-config.name': 'build-config'
        }
      }
    }
  });

  it('should render', () => {
    expect(wrapper).toHaveLength(1);
  });

  describe('BuildSummary', () => {
    it('should render', () => {
      const BuildSummary = wrapper.find('BuildSummary');

      expect(BuildSummary).toHaveLength(1);
      expect(BuildSummary.props().build).toEqual(build);
    });
  });

  describe('BuildPipelineStage', () => {
    it('should render', () => {
      const BuildPipelineStage = wrapper.find('BuildPipelineStage');

      expect(BuildPipelineStage).toHaveLength(1);
      expect(BuildPipelineStage.props().build).toEqual(build);
    });
  });

  describe('BuildDownload', () => {
    it('should match previous snapshot', () => {
      const BuildDownload = wrapper.find('BuildDownload');

      expect(BuildDownload).toMatchSnapshot();
    });
  });
});
