import _ from 'lodash-es';
import reducer from './errors';
import { DISMISS_ERROR, DISMISS_ALL_ERRORS, ERROR } from '../actions/errors';

const TEST_ERROR_MESSAGE1 = 'ERROR1';
const TEST_ERROR_MESSAGE2 = 'ERROR2';
const TEST_ERROR_MESSAGE3 = 'ERROR3';
const TEST_ERROR_MESSAGE4 = 'ERROR4';

const testState = {
  errors: [
    {
      message: TEST_ERROR_MESSAGE1
    },
    {
      message: TEST_ERROR_MESSAGE2
    },
    {
      message: TEST_ERROR_MESSAGE3
    }
  ]
};

describe('error reducer', () => {
  it('test dismiss all', () => {
    const state = _.cloneDeep(testState);
    const res = reducer(state, { type: DISMISS_ALL_ERRORS });
    expect(res.errors).toHaveLength(0);
    expect(_.isEqual(testState, state)).toBe(true); // Original state must be unchanged
  });
  it('test dismiss error', () => {
    const state = _.cloneDeep(testState);

    const expectedResult = {
      errors: [
        {
          message: TEST_ERROR_MESSAGE1
        },
        {
          message: TEST_ERROR_MESSAGE3
        }
      ]
    };

    const res = reducer(state, { type: DISMISS_ERROR, errorMessage: TEST_ERROR_MESSAGE2 });
    expect(_.isEqual(testState, state)).toBe(true); // Original state must be unchanged
    expect(_.isEqual(expectedResult, res)).toBe(true);
  });
  it('add error', () => {
    const state = _.cloneDeep(testState);

    let res = reducer(state, { type: ERROR, error: { message: TEST_ERROR_MESSAGE3 } });
    expect(_.isEqual(state, res)).toBe(true); // The message was already there
    res = reducer(state, { type: ERROR, error: { message: TEST_ERROR_MESSAGE4 } });
    expect(res.errors).toHaveLength(4);
    expect(_.some(res.errors, { message: TEST_ERROR_MESSAGE1 })).toBe(true); // The message was already there
    expect(_.some(res.errors, { message: TEST_ERROR_MESSAGE2 })).toBe(true); // The message was already there
    expect(_.some(res.errors, { message: TEST_ERROR_MESSAGE3 })).toBe(true); // The message was already there
    expect(_.some(res.errors, { message: TEST_ERROR_MESSAGE4 })).toBe(true); // The message was already there
    expect(_.isEqual(testState, state)).toBe(true); // Original state must be unchanged
  });
});
