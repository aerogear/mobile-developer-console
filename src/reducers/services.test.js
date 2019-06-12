import _ from 'lodash';
import reducer from './services';

import {
  SERVICES_REQUEST,
  SERVICES_SUCCESS,
  SERVICES_FAILURE,
  CUSTOM_RESOURCE_LIST_SUCCESS,
  CUSTOM_RESOURCE_ADDED_SUCCESS,
  CUSTOM_RESOURCE_DELETED_SUCCESS
} from '../actions/services';

const TEST_SERVICE1 = {
  name: 'TEST_SERVICE1',
  id: 1,
  customResources: []
};
const TEST_SERVICE2 = {
  name: 'TEST_SERVICE2',
  id: 2,
  customResources: []
};
const TEST_SERVICE3 = {
  name: 'TEST_SERVICE3',
  id: 3,
  customResources: []
};
const TEST_SERVICE2_REPLACEMENT = {
  name: 'TEST_SERVICE2',
  id: 4,
  customResources: []
};

const TEST_SERVICE4 = {
  name: 'TEST_SERVICE4',
  id: 5,
  customResources: []
};

const TEST_SERVICES = [TEST_SERVICE1, TEST_SERVICE2, TEST_SERVICE3];

const CUSTOM_RESOURCE1 = {
  metadata: { name: 'CR1' },
  id: 1
};
const CUSTOM_RESOURCE2 = {
  metadata: { name: 'CR2' },
  id: 2
};
const CUSTOM_RESOURCE3 = {
  metadata: { name: 'CR3' },
  id: 3
};

const TEST_CUSTOM_RESOURCES = [CUSTOM_RESOURCE1, CUSTOM_RESOURCE2, CUSTOM_RESOURCE3];

const initialState = {
  isFetching: false,
  items: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false
};

const initialStateWithServices = {
  ...initialState,
  items: _.cloneDeep(TEST_SERVICES)
};

describe('services reducer', () => {
  it('test services request', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: SERVICES_REQUEST });
    expect(res.isFetching).toBe(true);
    expect(state).toEqual(initialState);
  });
  it('test services success', () => {
    const state = _.cloneDeep(initialState);
    const res = reducer(state, { type: SERVICES_SUCCESS, result: { items: TEST_SERVICES } });
    expect(res.isFetching).toBe(false);
    expect(res.items).toEqual(TEST_SERVICES);
    expect(state).toEqual(initialState);
  });
  it('test services failure', () => {
    const state = _.cloneDeep(initialState);
    state.isFetching = true;
    const res = reducer(state, { type: SERVICES_FAILURE });
    expect(res.isFetching).toBe(false);
    expect(_.omit(state, 'isFetching')).toEqual(_.omit(initialState, 'isFetching'));
  });
  it('test custom resource list success - replace service', () => {
    const state = _.cloneDeep(initialStateWithServices);

    const res = reducer(state, {
      type: CUSTOM_RESOURCE_LIST_SUCCESS,
      service: TEST_SERVICE2_REPLACEMENT,
      items: TEST_CUSTOM_RESOURCES
    });

    expect(res.items).toHaveLength(3);
    expect(_.find(res.items, item => item.name === TEST_SERVICE1.name).id).toEqual(TEST_SERVICE1.id);
    expect(_.find(res.items, item => item.name === TEST_SERVICE2.name).id).toEqual(TEST_SERVICE2_REPLACEMENT.id);
    expect(_.find(res.items, item => item.name === TEST_SERVICE2.name).customResources).toEqual(TEST_CUSTOM_RESOURCES);
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).id).toEqual(TEST_SERVICE3.id);

    expect(state).toEqual(initialStateWithServices);
  });
  it('test custom resource list success - add service', () => {
    const state = _.cloneDeep(initialStateWithServices);

    const res = reducer(state, { type: CUSTOM_RESOURCE_LIST_SUCCESS, service: TEST_SERVICE4 });

    expect(res.items).toHaveLength(4);
    expect(_.find(res.items, item => item.name === TEST_SERVICE1.name).id).toEqual(TEST_SERVICE1.id);
    expect(_.find(res.items, item => item.name === TEST_SERVICE2.name).id).toEqual(TEST_SERVICE2.id);
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).id).toEqual(TEST_SERVICE3.id);
    expect(_.find(res.items, item => item.name === TEST_SERVICE4.name).id).toEqual(TEST_SERVICE4.id);

    expect(state).toEqual(initialStateWithServices); // passed in state must be unchanged (all changes must happens in a copy)
  });
  it('test custom resource added success', () => {
    const state = _.cloneDeep(initialStateWithServices);

    // NON EXISTING SERVICE
    let res = reducer(state, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE4 });
    expect(res.items).toHaveLength(3);

    // EXISTING SERVICE
    res = reducer(state, {
      type: CUSTOM_RESOURCE_ADDED_SUCCESS,
      service: TEST_SERVICE3,
      result: { metadata: { name: 'NEW_RESOURCE' } }
    });
    expect(res.items).toHaveLength(3);
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources).toHaveLength(1);
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources[0].metadata.name).toEqual(
      'NEW_RESOURCE'
    );
    res = reducer(res, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE1 });
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources).toHaveLength(2);
    res = reducer(res, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE1 });
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources).toHaveLength(2);
    res = reducer(res, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE2 });
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources).toHaveLength(3);

    expect(state).toEqual(initialStateWithServices); // passed in state must be unchanged (all changes must happens in a copy)
  });
  it('test custom resource deleted success', () => {
    const state = _.cloneDeep(initialStateWithServices);

    let res = reducer(state, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE1 });
    res = reducer(res, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE2 });
    res = reducer(res, { type: CUSTOM_RESOURCE_ADDED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE3 });
    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources).toHaveLength(3);

    res = reducer(res, { type: CUSTOM_RESOURCE_DELETED_SUCCESS, service: TEST_SERVICE3, result: CUSTOM_RESOURCE2 });

    expect(_.find(res.items, item => item.name === TEST_SERVICE3.name).customResources).toEqual([
      CUSTOM_RESOURCE1,
      CUSTOM_RESOURCE3
    ]);

    expect(state).toEqual(initialStateWithServices); // passed in state must be unchanged (all changes must happens in a copy)
  });
});
