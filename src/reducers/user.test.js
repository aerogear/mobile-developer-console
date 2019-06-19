import _ from 'lodash-es';
import reducer from './user';
import { USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAILURE } from '../actions/users';

const initialState = {
  currentUser: { name: 'Unknown' },
  loading: false,
  loadError: false
};

const TEST_USER = {
  name: 'test'
};

const TEST_ERROR = {
  messgae: 'Test error message',
  details: 'Test error details'
};

describe('user reducer', () => {
  it('test user info request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: USER_INFO_REQUEST });
    expect(res.loading).toBe(true);
    expect(res.loadError).toBe(false);
    expect(state).toEqual(initialState);
  });
  it('test user info success', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: USER_INFO_SUCCESS, result: TEST_USER });
    expect(res.loading).toBe(false);
    expect(res.loadError).toBe(false);
    expect(res.currentUser).toEqual(TEST_USER);
    expect(state).toEqual(initialState);
  });
  it('test user info failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: USER_INFO_FAILURE, error: TEST_ERROR });
    expect(res.loading).toBe(false);
    expect(res.loadError).toEqual(TEST_ERROR);
    expect(state).toEqual(initialState);
  });
});
