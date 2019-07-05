import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAILURE, fetchUserInfo } from './users';
import { ERROR } from './errors';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Actions', () => {
  let store;
  let initialState;

  beforeAll(() => {
    initialState = {};
  });

  describe('fetchUserInfo', () => {
    let user;

    beforeEach(() => {
      store = mockStore(initialState);
      user = { ...window.OPENSHIFT_CONFIG.user };
    });

    afterEach(() => {
      window.OPENSHIFT_CONFIG.user = user;
    });

    it('creates USER_INFO_SUCCESS action', () => {
      const expectedActions = [
        { type: USER_INFO_REQUEST },
        { result: window.OPENSHIFT_CONFIG.user, type: USER_INFO_SUCCESS }
      ];

      return store.dispatch(fetchUserInfo()).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('creates USER_INFO_FAILURE action', () => {
      const expectedActions = [
        { type: USER_INFO_REQUEST },
        { error: new Error('no user found'), type: USER_INFO_FAILURE },
        { error: new Error('no user found'), type: ERROR }
      ];

      window.OPENSHIFT_CONFIG.user = null;

      return store.dispatch(fetchUserInfo()).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });
  });
});
