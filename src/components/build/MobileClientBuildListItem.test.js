import { shallow } from 'enzyme';
import React from 'react';
import MobileClientBuildListItem from './MobileClientBuildListItem';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    appName: 'myapp1',
    buildConfiguration: {
      spec: {
        source: {
          git: {}
        },
        strategy: {
          jenkinsPipelineStrategy: {}
        }
      },
      metadata: {}
    }
  };

  const props = { ...defaultProps, ...propOverrides };

  const wrapper = shallow(<MobileClientBuildListItem {...props} />);

  return { wrapper, props };
};

describe('MobileClientBuildListItem', () => {
  describe('no builds', () => {
    const { wrapper } = setup();
    it('should render expected components', () => {
      expect(wrapper).toHaveLength(1);
      expect(wrapper.find('MobileListViewItem')).toHaveLength(1);
      expect(wrapper.find('MobileClientBuildHistoryList')).toHaveLength(0);
      expect(wrapper.find('NoBuild')).toHaveLength(1);
    });
  });

  describe('without build history', () => {
    const { wrapper } = setup({
      buildConfiguration: {
        metadata: {
          name: 'ionic-showcase',
          namespace: 'mobile-console'
        },
        spec: {
          source: {
            type: 'Git',
            git: {
              uri: 'https://github.com/aerogear/ionic-showcase.git',
              ref: 'master'
            }
          },
          strategy: {
            type: 'JenkinsPipeline',
            jenkinsPipelineStrategy: {
              jenkinsfilePath: 'Jenkinsfile',
              env: [
                {
                  name: 'BUILD_CONFIG',
                  value: 'debug'
                },
                {
                  name: 'PLATFORM',
                  value: 'android'
                }
              ]
            }
          }
        },
        status: {
          lastVersion: 3
        },
        builds: [
          {
            metadata: {
              name: 'ionic-showcase-1',
              namespace: 'mobile-console',
              annotations: {
                'openshift.io/build-config.name': 'ionic-showcase',
                'openshift.io/build.number': '1',
                'openshift.io/jenkins-console-log-url':
                  'https://jenkins-mobile-console.apps.redhat-exampkle.com/job/mobile-console/job/mobile-console-ionic-showcase/1/console'
              }
            },
            spec: {
              serviceAccount: 'builder',
              source: {
                type: 'Git',
                git: {
                  uri: 'https://github.com/aerogear/ionic-showcase.git',
                  ref: 'master'
                }
              }
            }
          }
        ]
      }
    });

    it('should not render build history items', () => {
      expect(wrapper.find('BuildInformation').find('Row')).toHaveLength(0);
    });
  });

  describe('with build history', () => {
    const { wrapper } = setup({
      buildConfiguration: {
        metadata: {
          name: 'ionic-showcase',
          namespace: 'mobile-console'
        },
        spec: {
          source: {
            type: 'Git',
            git: {
              uri: 'https://github.com/aerogear/ionic-showcase.git',
              ref: 'master'
            }
          },
          strategy: {
            type: 'JenkinsPipeline',
            jenkinsPipelineStrategy: {
              jenkinsfilePath: 'Jenkinsfile',
              env: [
                {
                  name: 'BUILD_CONFIG',
                  value: 'debug'
                },
                {
                  name: 'PLATFORM',
                  value: 'android'
                }
              ]
            }
          }
        },
        status: {
          lastVersion: 3
        },
        builds: [
          {
            metadata: {
              name: 'ionic-showcase-1',
              namespace: 'mobile-console',
              annotations: {
                'openshift.io/build-config.name': 'ionic-showcase',
                'openshift.io/build.number': '1',
                'openshift.io/jenkins-console-log-url':
                  'https://jenkins-mobile-console.apps.redhat-exampkle.com/job/mobile-console/job/mobile-console-ionic-showcase/1/console'
              }
            },
            spec: {
              serviceAccount: 'builder',
              source: {
                type: 'Git',
                git: {
                  uri: 'https://github.com/aerogear/ionic-showcase.git',
                  ref: 'master'
                }
              }
            }
          },
          {
            metadata: {
              name: 'ionic-showcase-2',
              namespace: 'mobile-console',
              annotations: {
                'openshift.io/build-config.name': 'ionic-showcase',
                'openshift.io/build.number': '2',
                'openshift.io/jenkins-console-log-url':
                  'https://jenkins-mobile-console.apps.redhat-exampkle.com/job/mobile-console/job/mobile-console-ionic-showcase/1/console'
              }
            },
            spec: {
              serviceAccount: 'builder',
              source: {
                type: 'Git',
                git: {
                  uri: 'https://github.com/aerogear/ionic-showcase.git',
                  ref: 'master'
                }
              }
            }
          }
        ]
      }
    });

    it('should render expected components', () => {
      expect(wrapper.find('NoBuild')).toHaveLength(0);
      expect(wrapper.find('div.mobile-chevron')).toHaveLength(1);
      expect(wrapper.find('MobileClientBuildHistoryList')).toHaveLength(0);
    });

    it('should render MobileClientBuildHistoryList when Button is clicked', () => {
      const toggleHistoryButton = wrapper.find('div.mobile-chevron').find('Button');

      expect(
        toggleHistoryButton.simulate('click', {
          preventDefault: () => {}
        })
      ).toHaveLength(1);
      wrapper.instance().forceUpdate();
      expect(wrapper.find('MobileClientBuildHistoryList')).toHaveLength(1);
    });
  });
});
