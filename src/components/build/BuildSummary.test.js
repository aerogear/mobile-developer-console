import React from 'react';
import { shallow } from 'enzyme';
import BuildSummary from './BuildSummary';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    build: {
      metadata: {
        annotations: {}
      },
      status: {}
    }
  };

  const props = { ...defaultProps, ...propOverrides };

  const wrapper = shallow(<BuildSummary {...props} />);

  return { wrapper, props };
};

describe('BuildSummary', () => {
  const {
    wrapper,
    props: {
      build,
      build: {
        buildUrl,
        metadata: {
          annotations: {
            'openshift.io/jenkins-console-log-url': jenkinsConsoleLogUrl,
            'openshift.io/build.number': buildNumber
          }
        }
      }
    }
  } = setup({
    build: {
      buildUrl: 'http://www.build.com/url',
      metadata: {
        annotations: {
          'openshift.io/jenkins-console-log-url': 'http://jenkins.console.url',
          'openshift.io/build.number': 7219219
        }
      },
      status: {
        startTimestamp: new Date()
      }
    }
  });

  const container = wrapper.find('div.build-summary-container');

  it('renders container', () => {
    expect(container).toHaveLength(1);
    expect(container.children()).toHaveLength(3);
  });

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('renders build url anchor', () => {
    const buildPhase = container.childAt(0);

    expect(buildPhase.hasClass('build-phase')).toBe(true);

    const anchor = buildPhase.find('a');

    expect(anchor).toHaveLength(1);
    expect(anchor.prop('href')).toEqual(buildUrl);
    expect(anchor.text()).toEqual(`Build #${buildNumber}`);
    expect(anchor.simulate('click')).toHaveLength(1);
  });

  it('renders BuildStatus', () => {
    const BuildStatus = container.childAt(0).find('BuildStatus');

    expect(BuildStatus).toHaveLength(1);
    expect(BuildStatus.prop('build')).toEqual(build);
  });

  it('renders formatted timestamp', () => {
    const timestampContainer = container.childAt(1);

    expect(timestampContainer.hasClass('build-timestamp')).toBe(true);
    expect(timestampContainer.childAt(0).type()).toBeInstanceOf(Function);
    expect(
      timestampContainer
        .childAt(0)
        .render()
        .text()
    ).toEqual('a few seconds ago');
  });

  it('renders console log url', () => {
    const buildLinks = container.childAt(2);

    expect(buildLinks.hasClass('build-links')).toBe(true);

    const anchor = buildLinks.find('a');

    expect(anchor).toHaveLength(1);
    expect(anchor.prop('href')).toBe(jenkinsConsoleLogUrl);
  });
});
