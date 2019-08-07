import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  setFieldValue,
  editApp,
  resetForm,
  fetchApp,
  APP_FIELD_SETVALUE,
  APP_EDIT,
  APP_FORM_RESET,
  APP_REQUEST,
  APP_SUCCESS,
  APP_FAILURE,
  APP_CREATE_REQUEST,
  APP_CREATE_SUCCESS,
  createApp,
  APP_CREATE_FAILURE,
  APP_UPDATE_SUCCESS,
  APP_UPDATE_REQUEST,
  updateApp,
  APP_UPDATE_FAILURE,
  deleteApp,
  APP_DELETE_REQUEST,
  APP_DELETE_SUCCESS,
  APP_DELETE_FAILURE
} from './apps';
import { MobileApp } from '../models';
import { ERROR } from './errors';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const { masterUri, mdcNamespace } = window.OPENSHIFT_CONFIG;
const mockApp = {
  apiVersion: 'mdc.aerogear.org/v1alpha1',
  kind: 'MobileClient',
  metadata: {
    creationTimestamp: '2019-06-13T10:24:09Z',
    generation: 1,
    name: 'myapp',
    namespace: mdcNamespace,
    resourceVersion: '771851',
    selfLink: `/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/myapp`,
    uid: '616e0659-8dc5-11e9-986e-525400af1a76'
  },
  spec: { name: 'myapp' },
  status: {}
};

describe('synchronous actions', () => {
  it('setFieldValue should set field value', () => {
    const fieldId = '12345';
    const value = 'hello-world';
    const isValid = true;

    const expectedAction = {
      type: APP_FIELD_SETVALUE,
      payload: { name: fieldId, value, valid: isValid }
    };

    expect(setFieldValue(fieldId, value, isValid)).toEqual(expectedAction);
  });

  it('editApp dispatches APP_EDIT with correct payload', () => {
    const mobileApp = new MobileApp(mockApp);

    const expectedAction = {
      type: APP_EDIT,
      payload: mobileApp.toJSON()
    };

    expect(editApp(mobileApp)).toEqual(expectedAction);
  });

  it('editApp dispatches APP_EDIT with null payload', () => {
    const mobileApp = null;

    const expectedAction = {
      type: APP_EDIT,
      payload: mobileApp
    };

    expect(editApp(mobileApp)).toEqual(expectedAction);
  });

  it('resetForm dispatches APP_FORM_RESET action', () => {
    const expectedAction = {
      type: APP_FORM_RESET
    };
    expect(resetForm()).toEqual(expectedAction);
  });
});

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

  describe('fetchApp', () => {
    it('dispatches APP_FAILURE action', () => {
      mock
        .onGet(
          `${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/${mockApp.metadata.name}`
        )
        .reply(404);

      const expectedActions = [
        { type: APP_REQUEST },
        { error: new Error('Request failed with status code 404'), type: APP_FAILURE },
        { error: new Error('Request failed with status code 404'), type: ERROR }
      ];

      return store.dispatch(fetchApp('myapp1')).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('dispatches APP_SUCCESS action', () => {
      mock
        .onGet(
          `${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/${mockApp.metadata.name}`
        )
        .reply(200, mockApp);

      const expectedActions = [{ type: APP_REQUEST }, { type: APP_SUCCESS, result: mockApp }];

      return store.dispatch(fetchApp('myapp')).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('createApp', () => {
    it('dispatches APP_CREATE_SUCCESS action', () => {
      mock
        .onPost(`${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients`)
        .reply(201, mockApp);

      const expectedActions = [{ type: APP_CREATE_REQUEST }, { type: APP_CREATE_SUCCESS, result: mockApp }];

      return store.dispatch(createApp(new MobileApp(mockApp))).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('dispatches APP_CREATE_FAILURE action', () => {
      mock.onPost(`${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients`).reply(409);

      const expectedActions = [
        { type: APP_CREATE_REQUEST },
        { error: new Error('Request failed with status code 409'), type: APP_CREATE_FAILURE },
        { error: new Error('Request failed with status code 409'), type: ERROR }
      ];

      return store.dispatch(createApp(new MobileApp(mockApp))).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('updateApp', () => {
    it('dispatches APP_UPDATE_SUCCESS action', () => {
      mock
        .onPut(
          `${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/${mockApp.metadata.name}`,
          mockApp
        )
        .reply(200, mockApp);

      const expectedActions = [{ type: APP_UPDATE_REQUEST }, { type: APP_UPDATE_SUCCESS, result: mockApp }];

      return store.dispatch(updateApp(new MobileApp(mockApp))).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('dispatches APP_UPDATE_FAILURE action', () => {
      mock
        .onPut(
          `${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/${mockApp.metadata.name}`,
          mockApp
        )
        .reply(409);

      const expectedActions = [
        { type: APP_UPDATE_REQUEST },
        { error: new Error('Request failed with status code 409'), type: APP_UPDATE_FAILURE },
        { error: new Error('Request failed with status code 409'), type: ERROR }
      ];

      return store.dispatch(updateApp(new MobileApp(mockApp))).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });

  describe('deleteApp', () => {
    it('dispatches APP_DELETE_SUCCESS action', () => {
      const response = {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Success',
        details: {
          name: 'myapp',
          group: 'mdc.aerogear.org',
          kind: 'mobileclients',
          uid: '616e0659-8dc5-11e9-986e-525400af1a76'
        }
      };

      mock
        .onDelete(
          `${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/${mockApp.metadata.name}`
        )
        .reply(200, response);

      const expectedActions = [{ type: APP_DELETE_REQUEST }, { type: APP_DELETE_SUCCESS, result: response }];

      return store.dispatch(deleteApp('myapp')).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('dispatches APP_DELETE_FAILURE action', () => {
      mock
        .onDelete(
          `${masterUri}/apis/mdc.aerogear.org/v1alpha1/namespaces/${mdcNamespace}/mobileclients/${mockApp.metadata.name}`
        )
        .reply(404);

      const expectedActions = [
        { type: APP_DELETE_REQUEST },
        { error: new Error('Request failed with status code 404'), type: APP_DELETE_FAILURE },
        { error: new Error('Request failed with status code 404'), type: ERROR }
      ];

      return store.dispatch(deleteApp('myapp')).catch(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });
});
