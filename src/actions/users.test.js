import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAILURE, fetchUserInfo } from './users';
import { ERROR } from './errors';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const userInfoRequest = 'USER_INFO_REQUEST';
const userInfoSuccess = 'USER_INFO_SUCCESS';
const userInfoFailure = 'USER_INFO_FAILURE';

const result = {
  accessToken: 'vlseTWA8LXFz6X5kBH2BJO2l33GRZSPZAHA2-FHGC94',
  name: 'mockuser',
  email: 'mockuser@example.com'
};

describe('All constants remain unchanged', () => {
  it('USER_INFO_REQUEST == USER_INFO_REQUEST', () => {
    expect(USER_INFO_REQUEST).toEqual(userInfoRequest);
  });

  it('USER_INFO_SUCCESS == USER_INFO_SUCCESS', () => {
    expect(USER_INFO_SUCCESS).toEqual(userInfoSuccess);
  });

  it('USER_INFO_FAILURE == USER_INFO_FAILURE', () => {
    expect(USER_INFO_FAILURE).toEqual(userInfoFailure);
  });
});

describe('Test actions', () => {
  let store;
  let initialState;

  beforeAll(() => {
    initialState = {};
  });

  beforeEach(() => {
    store = mockStore(initialState);
  });

  describe('fetchUserInfo', () => {
    it('successfully fetch user info', () => {
      const expectedActions = [{ type: userInfoRequest }, { result, type: userInfoSuccess }];

      return store.dispatch(fetchUserInfo()).then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
      });
    });

    it('window.OPENSHIFT_CONFIG.user = null', () => {
      const expectedActions = [
        { type: userInfoRequest },
        { error: new Error('no user found'), type: userInfoFailure },
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
