import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  BUILD_CONFIG_DELETE_REQUEST,
  BUILD_CONFIG_DELETE_SUCCESS,
  BUILD_CONFIG_DELETE_FAILURE,
  createSetBuildConfigValue,
  BUILD_CONFIG_FIELD_SET_VALUE,
  BUILD_CONFIG_FIELD_SET_UI_STATE,
  setUiState,
  BUILD_CONFIG_FIELD_REMOVE_VALUE,
  createRemoveValues,
  clearState,
  BUILD_CONFIG_CLEAR_STATE,
  deleteBuildConfig,
  BUILD_CONFIG_CREATE_REQUEST,
  BUILD_CONFIG_CREATE_SUCCESS,
  createBuildConfig,
  BUILD_CONFIG_CREATE_FAILURE
} from './buildConfigs';
import { ERROR } from './errors';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const { masterUri, mdcNamespace } = window.OPENSHIFT_CONFIG;
const mockConfig = {
  source: {
    authType: 'public',
    gitRef: 'master',
    jenkinsFilePath: './',
    gitUrl: 'https://github.com/aerogear/ionic-showcase.git'
  },
  build: {
    platform: 'android',
    buildType: 'debug'
  },
  name: 'bc1',
  clientId: 'myapp'
};

const mockResponse = {
  metadata: {
    name: 'bc1',
    namespace: mdcNamespace,
    labels: { 'mobile-client-build': 'true', 'mobile-client-build-platform': 'android', 'mobile-client-id': 'myapp' }
  },
  spec: {
    source: { type: 'git', git: { uri: 'https://github.com/aerogear/ionic-showcase.git', ref: 'master' } },
    strategy: {
      type: 'JenkinsPipeline',
      jenkinsPipelineStrategy: {
        jenkinsfilePath: './',
        env: [{ name: 'BUILD_CONFIG', value: 'debug' }, { name: 'PLATFORM', value: 'android' }]
      }
    }
  },
  apiVersion: 'build.openshift.io/v1',
  kind: 'BuildConfig'
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

  describe('deleteBuildConfig', () => {
    it('creates BUILD_CONFIG_DELETE_SUCCESS action', () => {
      const name = 'bc1';
      const response = {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Success',
        details: {
          name,
          group: 'build.openshift.io',
          kind: 'buildconfigs',
          uid: '2379105d-90d9-11e9-b1a3-525400af1a76'
        }
      };

      mock
        .onDelete(`${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs/${name}`)
        .reply(200, response);

      const expectedActions = [
        { type: BUILD_CONFIG_DELETE_REQUEST },
        { type: BUILD_CONFIG_DELETE_SUCCESS, result: response }
      ];

      store.dispatch(deleteBuildConfig(name)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('creates BUILD_CONFIG_DELETE_FAILURE action', () => {
      const name = 'bc1';
      mock
        .onDelete(`${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs/${name}`)
        .reply(404);

      const expectedActions = [
        { type: BUILD_CONFIG_DELETE_REQUEST },
        { error: new Error('Request failed with status code 404'), type: BUILD_CONFIG_DELETE_FAILURE },
        { error: new Error('Request failed with status code 404'), type: ERROR }
      ];

      store.dispatch(deleteBuildConfig(name)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('createBuildConfig', () => {
    it('creates BUILD_CONFIG_CREATE_SUCCESS action', () => {
      mock
        .onPost(`${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs`)
        .reply(200, mockResponse);

      const expectedActions = [
        { type: BUILD_CONFIG_CREATE_REQUEST },
        { type: BUILD_CONFIG_CREATE_SUCCESS, result: [] }
      ];

      store.dispatch(createBuildConfig(mockConfig)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('creates BUILD_CONFIG_CREATE_FAILURE action', () => {
      mock.onPost(`${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs`).reply(401);

      const expectedActions = [
        { type: BUILD_CONFIG_CREATE_REQUEST },
        { error: new Error('Request failed with status code 401'), type: BUILD_CONFIG_CREATE_FAILURE },
        { error: new Error('Request failed with status code 401'), type: ERROR }
      ];

      store.dispatch(createBuildConfig(mockConfig)).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });

  it('creates BUILD_CONFIG_CREATE_FAILURE action', () => {
    mock.onPost(`${masterUri}/apis/build.openshift.io/v1/namespaces/${mdcNamespace}/buildconfigs`).reply(404);

    const expectedActions = [
      { type: BUILD_CONFIG_CREATE_REQUEST },
      { error: new Error('Request failed with status code 404'), type: BUILD_CONFIG_CREATE_FAILURE },
      { error: new Error('Request failed with status code 404'), type: ERROR }
    ];

    store.dispatch(createBuildConfig(mockConfig)).then(() => {
      const actions = store.getActions();
      expect(actions).toEqual(expectedActions);
    });
  });
});

describe('actions', () => {
  it('createSetBuildConfigValue should create BUILD_CONFIG_FIELD_SET_VALUE action', () => {
    const path = 'config';
    const fieldId = 'platform';
    const value = 'Android';
    const isValid = true;

    const expectedAction = {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: {
        path,
        name: fieldId,
        value,
        valid: isValid
      }
    };

    expect(createSetBuildConfigValue(path)(fieldId, value, isValid)).toEqual(expectedAction);
  });

  it('setUiState should create BUILD_CONFIG_FIELD_SET_UI_STATE action', () => {
    const fieldId = 'platform';
    const value = 'iOS';

    const expectedAction = {
      type: BUILD_CONFIG_FIELD_SET_UI_STATE,
      payload: {
        name: fieldId,
        value
      }
    };

    expect(setUiState(fieldId, value)).toEqual(expectedAction);
  });

  it('createRemoveValues should create BUILD_CONFIG_FIELD_REMOVE_VALUE action', () => {
    const path = 'config';
    const val1 = 'val1';
    const val2 = 'val2';

    const expectedAction = {
      type: BUILD_CONFIG_FIELD_REMOVE_VALUE,
      payload: { path, values: [val1, val2] }
    };

    expect(createRemoveValues(path)(val1, val2)).toEqual(expectedAction);
  });

  it('clearState should create BUILD_CONFIG_CLEAR_STATE action', () => {
    expect(clearState()).toEqual({ type: BUILD_CONFIG_CLEAR_STATE });
  });
});
