import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  triggerBuild,
  BUILD_TRIGGER_REQUEST,
  BUILD_TRIGGER_SUCCESS,
  BUILD_TRIGGER_FAILURE,
  generateDownloadURL,
  BUILD_DOWNLOAD_REQUEST,
  BUILD_DOWNLOAD_FAILURE
} from './builds';
import { ERROR } from './errors';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const { masterUri, mdcNamespace } = window.OPENSHIFT_CONFIG;

const buildConfigName = 'bc1';

const mockResponse = {
  kind: 'Build',
  apiVersion: 'build.openshift.io/v1',
  metadata: {
    name: buildConfigName,
    namespace: mdcNamespace,
    selfLink: '/apis/build.openshift.io/v1/namespaces/mobile-console/buildconfigs/helo-1/instantiate',
    uid: 'a70c34f1-9cac-11e9-9147-52540051d0ab',
    resourceVersion: '171639',
    creationTimestamp: '2019-07-02T09:34:56Z',
    annotations: {
      'openshift.io/build-config.name': buildConfigName,
      'openshift.io/build.number': '1',
      'openshift.io/jenkins-blueocean-log-url':
        'https://jenkins-mobile-console.192.168.42.205.nip.io/blue/organizations/jenkins/mobile-console%2Fmobile-console-bc1/detail/mobile-console-bc1/1/',
      'openshift.io/jenkins-build-uri':
        'https://jenkins-mobile-console.192.168.42.205.nip.io/job/mobile-console/job/mobile-console-bc1/1/',
      'openshift.io/jenkins-console-log-url':
        'https://jenkins-mobile-console.192.168.42.205.nip.io/job/mobile-console/job/mobile-console-bc1/1/console',
      'openshift.io/jenkins-log-url':
        'https://jenkins-mobile-console.192.168.42.205.nip.io/job/mobile-console/job/mobile-console-bc1/1/consoleText',
      'openshift.io/jenkins-status-json':
        '{"_links":{"self":{"href":"https://jenkins-mobile-console.192.168.42.205.nip.io/job/mobile-console/job/mobile-console-bc1/1/wfapi/describe"},"changesets":null,"pendingInputActions":null,"nextPendingInputAction":null,"artifacts":null},"id":"1","name":"#1","status":"NOT_EXECUTED","startTimeMillis":1562082081214,"endTimeMillis":1562082125379,"durationMillis":44165,"queueDurationMillis":995,"pauseDurationMillis":0,"stages":[]}'
    }
  },
  labels: {
    buildconfig: buildConfigName,
    'mobile-client-build': 'true',
    'mobile-client-build-platform': 'android',
    'mobile-client-id': 'myapp',
    'openshift.io/build-config.name': buildConfigName,
    'openshift.io/build.start-policy': 'Serial'
  }
};

describe('async actions', () => {
  let store;
  let initialState;
  let mock;

  beforeAll(() => {
    initialState = {};
  });

  beforeEach(() => {
    store = mockStore(initialState);
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  describe('triggerBuild', () => {
    it('creates BUILD_TRIGGER_SUCCESS action', () => {
      mock
        .onPost(
          `${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs/${buildConfigName}/instantiate`
        )
        .reply(201, mockResponse);

      const expectedActions = [{ type: BUILD_TRIGGER_REQUEST }, { type: BUILD_TRIGGER_SUCCESS, result: mockResponse }];

      return store.dispatch(triggerBuild(buildConfigName)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('creates BUILD_TRIGGER_FAILURE action', () => {
      mock
        .onPost(
          `${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs/${buildConfigName}/instantiate`
        )
        .reply(404);

      const expectedActions = [
        { type: BUILD_TRIGGER_REQUEST },
        { error: new Error('Request failed with status code 404'), type: BUILD_TRIGGER_FAILURE },
        { error: new Error('Request failed with status code 404'), type: ERROR }
      ];

      return store.dispatch(triggerBuild(buildConfigName)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('generateDownloadURL', () => {
    // TODO: Add test for BUILD_DOWNLOAD_SUCCESS action
    it('creates a BUILD_DOWNLOAD_FAILURE action', () => {
      mock
        .onGet(`${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/builds/${buildConfigName}`)
        .reply(404);

      const expectedActions = [
        { type: BUILD_DOWNLOAD_REQUEST },
        { error: new Error('Request failed with status code 404'), type: BUILD_DOWNLOAD_FAILURE },
        { error: new Error('Request failed with status code 404'), type: ERROR }
      ];

      return store.dispatch(generateDownloadURL(buildConfigName)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });
});
