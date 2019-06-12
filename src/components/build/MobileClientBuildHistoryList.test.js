import { shallow } from 'enzyme';
import React from 'react';
import moment from 'moment';
import MobileClientBuildHistoryList from './MobileClientBuildHistoryList';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    appName: '',
    id: 'demo',
    mobileClientBuilds: {}
  };

  const props = { ...defaultProps, ...propOverrides };
  const wrapper = shallow(<MobileClientBuildHistoryList {...props} />);

  return { props, wrapper };
};

describe('MobileClientBuildHistoryList', () => {
  const {
    wrapper,
    props: { mobileClientBuilds }
  } = setup({
    appName: 'myapp',
    id: 'test',
    mobileClientBuilds: [
      {
        status: {
          phase: 'Running',
          startTimestamp: new Date(),
          completionTimestamp: new Date()
        },
        metadata: {
          annotations: {
            'openshift.io/build.number': 143949,
            'openshift.io/jenkins-console-log-url': 'http://www.jenkins.console.log/url'
          },
          uid: '5d938090-8c2c-11e9-bc42-526af7764f64'
        },
        buildUrl: 'http://build.url'
      },
      {
        status: {
          phase: 'Stopped',
          startTimestamp: new Date(),
          completionTimestamp: new Date()
        },
        metadata: {
          annotations: {
            'openshift.io/build.number': 3249499,
            'openshift.io/jenkins-console-log-url': 'http://www.jenkins.console.log/url'
          },
          uid: '3d9b660d-c839-48bc-b8bc-6c5496f80968'
        },
        buildUrl: 'http://build.url'
      }
    ]
  });

  it('should render', () => {
    expect(wrapper).toHaveLength(1);
  });

  it(`should render ${mobileClientBuilds.length} <Col/> components`, () => {
    expect(wrapper.find('.mobile-client-build-history-item')).toHaveLength(mobileClientBuilds.length);
  });

  mobileClientBuilds.forEach((mobileClientBuild, index) => {
    const {
      status: { phase, startTimestamp, completionTimestamp },
      metadata: {
        annotations: {
          'openshift.io/build.number': buildNumber,
          'openshift.io/jenkins-console-log-url': jenkinsConsoleLogUrl
        }
      },
      buildUrl
    } = mobileClientBuild;

    const duration = moment(completionTimestamp).valueOf() - moment(startTimestamp).valueOf();

    describe(`Build Item ${index + 1}`, () => {
      const buildItem = wrapper.find('.mobile-client-build-history-item').at(index);
      const buildSummary = buildItem.find('div.build-summary');
      const a = buildSummary.find('a');

      it('BuildStatus should have expected props', () => {
        const BuildStatus = buildSummary.find('BuildStatus');

        expect(BuildStatus).toHaveLength(1);
        expect(BuildStatus.prop('build')).toEqual(mobileClientBuild);
      });

      it('<a/> should have expected text and props', () => {
        expect(a.prop('href')).toEqual(buildUrl);
        expect(a.text()).toEqual(`Build #${buildNumber}`);
      });

      it('div.info.status should render expected text', () => {
        expect(buildItem.find('.status').text()).toBe(phase);
      });

      it('.left-margin-link should render', () => {
        expect(buildItem.find('a.left-margin-link').prop('href')).toBe(jenkinsConsoleLogUrl);
      });

      it('Duration should render expected props', () => {
        const Duration = buildItem.find('Duration');

        expect(Duration.prop('duration')).toBe(duration);
        expect(Duration.prop('inProgress')).toBe(phase === 'Running');
      });

      it('.build-timestamp renders formatted timestamp', () => {
        const Moment = buildItem.find('.build-timestamp').childAt(0);

        expect(Moment.type()).toBeInstanceOf(Function);
        expect(Moment.render().text()).toEqual('a few seconds ago');
      });

      const BuildDownload = buildItem.find('.download').childAt(0);

      it('BuildDownload should have expected props', () => {
        const { history, build, appName } = BuildDownload.props();

        expect(history).toBe(true);
        expect(build).toBe(mobileClientBuild);
        expect(appName).toBe('myapp');
      });
    });
  });
});
