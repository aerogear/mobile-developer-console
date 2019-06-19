import _ from 'lodash-es';
import resourceReducer from './resource';

const TEST_LIST_REQUEST = 'TEST_LIST_REQUEST';
const TEST_LIST_SUCCESS = 'TEST_LIST_SUCCESS';
const TEST_LIST_FAILURE = 'TEST_LIST_FAILURE';
const TEST_READ_REQUEST = 'TEST_READ_REQUEST';
const TEST_READ_SUCCESS = 'TEST_READ_SUCCESS';
const TEST_READ_FAILURE = 'TEST_READ_FAILURE';
const TEST_CREATE_REQUEST = 'TEST_CREATE_REQUEST';
const TEST_CREATE_SUCCESS = 'TEST_CREATE_SUCCESS';
const TEST_CREATE_FAILURE = 'TEST_CREATE_FAILURE';
const TEST_UPDATE_REQUEST = 'TEST_UPDATE_REQUEST';
const TEST_UPDATE_SUCCESS = 'TEST_UPDATE_SUCCESS';
const TEST_UPDATE_FAILURE = 'TEST_UPDATE_FAILURE';
const TEST_DELETE_REQUEST = 'TEST_DELETE_REQUEST';
const TEST_DELETE_SUCCESS = 'TEST_DELETE_SUCCESS';
const TEST_DELETE_FAILURE = 'TEST_DELETE_FAILURE';
const TEST_ACTION_REQUEST = 'TEST_ACTION_REQUEST';
const TEST_ACTION_SUCCESS = 'TEST_ACTION_SUCCESS';
const TEST_ACTION_FAILURE = 'TEST_ACTION_FAILURE';

const reducer = resourceReducer({
  listRequest: TEST_LIST_REQUEST,
  listSuccess: TEST_LIST_SUCCESS,
  listFailure: TEST_LIST_FAILURE,
  readRequest: TEST_READ_REQUEST,
  readSuccess: TEST_READ_SUCCESS,
  readFailure: TEST_READ_FAILURE,
  createRequest: TEST_CREATE_REQUEST,
  createSuccess: TEST_CREATE_SUCCESS,
  createFailure: TEST_CREATE_FAILURE,
  updateRequest: TEST_UPDATE_REQUEST,
  updateSuccess: TEST_UPDATE_SUCCESS,
  updateFailure: TEST_UPDATE_FAILURE,
  deleteRequest: TEST_DELETE_REQUEST,
  deleteSuccess: TEST_DELETE_SUCCESS,
  deleteFailure: TEST_DELETE_FAILURE,
  actionRequest: TEST_ACTION_REQUEST,
  actionSuccess: TEST_ACTION_SUCCESS,
  actionFailure: TEST_ACTION_FAILURE
});

const ITEM1 = _.set({ old: true }, 'metadata.name', 'ITEM1');
const ITEM2 = _.set({ old: true }, 'metadata.name', 'ITEM2');
const ITEM3 = _.set({ old: true }, 'metadata.name', 'ITEM3');
const ITEM4 = _.set({ old: true }, 'metadata.name', 'ITEM4');

const ITEM3_NEW = _.set({ old: false }, 'metadata.name', 'ITEM3');
const ITEM5_NEW = _.set({ old: false }, 'metadata.name', 'ITEM5');

const initialState = {
  isFetching: false,
  items: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false,
  fetched: false
};

const initialStateWithItems = {
  isFetching: false,
  items: [ITEM1, ITEM2, ITEM3, ITEM4],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false,
  fetched: false
};

describe('error resource reducer', () => {
  it('test list request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_LIST_REQUEST });
    expect(res.isFetching).toBe(true);
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test list success', () => {
    const TEST_ITEMS = ['ITEM1', 'ITEM2', 'ITEM3', 'ITEM4'];
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_LIST_SUCCESS, result: { items: TEST_ITEMS } });
    expect(res.isFetching).toBe(false);
    expect(res.fetched).toBe(true);
    expect(res.items).toEqual(TEST_ITEMS);
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test list failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_LIST_FAILURE });
    expect(res).toEqual({
      ...state,
      isFetching: false
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });

  it('test read request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_READ_REQUEST });
    expect(res).toEqual({
      ...state,
      isReading: true
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test read success', () => {
    const state = _.cloneDeep(initialStateWithItems);
    let res = reducer(state, { type: TEST_READ_SUCCESS, result: ITEM3_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isReading: false,
      items: [ITEM1, ITEM2, ITEM3_NEW, ITEM4]
    });

    res = reducer(res, { type: TEST_CREATE_SUCCESS, result: ITEM5_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isReading: false,
      items: [ITEM1, ITEM2, ITEM3_NEW, ITEM4, ITEM5_NEW]
    });
    expect(state).toEqual(initialStateWithItems); // Original state must be unchanged
  });
  it('test read failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_READ_FAILURE });
    expect(res).toEqual({
      ...state,
      isReading: false
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });

  it('test create request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_CREATE_REQUEST });
    expect(res).toEqual({
      ...state,
      isCreating: true
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test create success', () => {
    const state = _.cloneDeep(initialStateWithItems);
    let res = reducer(state, { type: TEST_CREATE_SUCCESS, result: ITEM3_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isCreating: false,
      items: [ITEM1, ITEM2, ITEM3, ITEM4]
    });

    res = reducer(res, { type: TEST_CREATE_SUCCESS, result: ITEM5_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isCreating: false,
      items: [ITEM1, ITEM2, ITEM3, ITEM4, ITEM5_NEW]
    });
    expect(state).toEqual(initialStateWithItems); // Original state must be unchanged
  });
  it('test create failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_CREATE_FAILURE });
    expect(res).toEqual({
      ...state,
      isCreating: false
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });

  it('test update request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_UPDATE_REQUEST });
    expect(res).toEqual({
      ...state,
      isUpdating: true,
      updateError: false
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test update success', () => {
    const state = _.cloneDeep(initialStateWithItems);
    let res = reducer(state, { type: TEST_UPDATE_SUCCESS, result: ITEM3_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isUpdating: false,
      updateError: false,
      items: [ITEM1, ITEM2, ITEM3_NEW, ITEM4]
    });

    res = reducer(res, { type: TEST_UPDATE_SUCCESS, result: ITEM5_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isUpdating: false,
      updateError: false,
      items: [ITEM1, ITEM2, ITEM3_NEW, ITEM4]
    });
    expect(state).toEqual(initialStateWithItems); // Original state must be unchanged
  });
  it('test update failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_UPDATE_FAILURE, error: 'test error' });
    expect(res).toEqual({
      ...state,
      isUpdating: false,
      updateError: 'test error'
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });

  it('test delete request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_DELETE_REQUEST });
    expect(res).toEqual({
      ...state,
      isDeleting: true
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test delete success', () => {
    const state = _.cloneDeep(initialStateWithItems);
    let res = reducer(state, { type: TEST_DELETE_SUCCESS, result: ITEM3 });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isDeleting: false,
      items: [ITEM1, ITEM2, ITEM4]
    });

    res = reducer(res, { type: TEST_DELETE_SUCCESS, result: ITEM5_NEW });
    expect(res).toEqual({
      ..._.cloneDeep(state),
      isDeleting: false,
      items: [ITEM1, ITEM2, ITEM4]
    });
    expect(state).toEqual(initialStateWithItems); // Original state must be unchanged
  });
  it('test delete failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_DELETE_FAILURE });
    expect(res).toEqual({
      ...state,
      isDeleting: false
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });

  it('test action request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_ACTION_REQUEST });
    expect(res).toEqual({
      ...state,
      isActioning: true
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('test action success', () => {
    const state = _.cloneDeep(initialStateWithItems);
    const res = reducer(state, { type: TEST_ACTION_SUCCESS });
    expect(res).toEqual({
      ...state,
      isActioning: false
    });
    expect(state).toEqual(initialStateWithItems); // Original state must be unchanged
  });
  it('test action failure', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: TEST_ACTION_FAILURE });
    expect(res).toEqual({
      ...state,
      isActioning: false
    });
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
});
