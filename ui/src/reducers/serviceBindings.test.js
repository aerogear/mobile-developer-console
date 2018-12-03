import {
  SERVICE_BINDINGS_REQUEST,
  SERVICE_BINDINGS_SUCCESS,
  SERVICE_BINDINGS_FAILURE,
  SERVICE_BINDING_CREATE_REQUEST,
  SERVICE_BINDING_CREATE_SUCCESS,
  SERVICE_BINDING_CREATE_FAILURE,
  SERVICE_BINDING_DELETE_REQUEST,
  SERVICE_BINDING_DELETE_SUCCESS,
  SERVICE_BINDING_DELETE_FAILURE
} from '../actions/serviceBinding';
import serviceBindingReducer from './serviceBindings';
import { MobileService } from '../models';

const defaultState = {
  isFetching: false,
  services: [],
  errors: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false
};

function getInitialState() {
  // ensure deep copy
  return JSON.parse(JSON.stringify(defaultState));
}

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}

function createService(serviceInstanceName, bindingName) {
  const json = {
    name: `test${randomInt(0, 10000)}`,
    serviceInstance: {
      metadata: {
        name: serviceInstanceName
      }
    }
  };
  if (bindingName) {
    json.serviceBindings = [
      {
        metadata: {
          name: bindingName
        },
        status: {
          conditions: []
        }
      }
    ];
  }
  return new MobileService(json);
}

describe('Fetch Bindings', () => {
  it('test service bindings request', () => {
    const initialState = { ...getInitialState() };
    const newState = serviceBindingReducer(initialState, { type: SERVICE_BINDINGS_REQUEST });
    expect(newState).toEqual({ ...initialState, isReading: true });
    expect(initialState).toEqual(defaultState);
  });

  it('test service bindings success', () => {
    const initialState = { ...getInitialState() };
    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDINGS_SUCCESS,
      result: [createService('test-instance', 'test-binding1'), createService('test-instance1', 'test-binding2')]
    });
    expect(newState.isReading).toBe(false);
    expect(newState.services).toHaveLength(2);
  });

  it('test service bindings failure', () => {
    const initialState = { ...getInitialState() };

    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDINGS_FAILURE,
      error: 'service binding test fetching error'
    });
    expect(newState.isReading).toBe(false);
    expect(newState.errors).toHaveLength(1);
    expect(newState.errors[0]).toEqual({ error: 'service binding test fetching error', type: 'read' });
  });
});

describe('Create Binding', () => {
  it('test create request', () => {
    const initialState = { ...getInitialState() };
    const newState = serviceBindingReducer(initialState, { type: SERVICE_BINDING_CREATE_REQUEST });
    expect(newState).toEqual({ ...initialState, isCreating: true });
    expect(initialState).toEqual(defaultState);
  });

  it('test create success', () => {
    const initialState = {
      ...getInitialState(),
      services: [createService('test-instance')]
    };

    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_CREATE_SUCCESS,
      result: { serviceInstanceName: 'test-instance' }
    });
    expect(newState.isCreating).toBe(false);
    expect(newState.services).toHaveLength(1);
    const service = newState.services[0];
    expect(service.serviceBindings).toHaveLength(1);
    expect(service.isBindingOperationInProgress()).toBe(true);
  });

  it('test create success in case of multiple bindings', () => {
    const initialState = {
      ...getInitialState(),
      services: [createService('test-instance')]
    };

    let newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_CREATE_SUCCESS,
      result: { serviceInstanceName: 'test-instance' }
    });
    expect(newState.isCreating).toBe(false);
    expect(newState.services).toHaveLength(1);
    let service = newState.services[0];
    expect(service.isBindingOperationInProgress()).toBe(true);
    expect(service.serviceBindings).toHaveLength(1);

    newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_CREATE_SUCCESS,
      result: { serviceInstanceName: 'test-instance' }
    });
    [service] = newState.services;
    expect(service.serviceBindings).toHaveLength(2);
  });

  it('test create failure', () => {
    const initialState = {
      ...getInitialState(),
      services: [createService('test-instance')]
    };

    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_CREATE_FAILURE,
      error: 'service binding test error'
    });
    expect(newState.isCreating).toBe(false);
    expect(newState.services).toHaveLength(1);
    expect(newState.services[0].serviceBindings).toHaveLength(0);
    expect(newState.errors).toHaveLength(1);
    expect(newState.errors[0]).toEqual({ error: 'service binding test error', type: 'create' });
  });

  it('test create failure  in case of multiple bindings', () => {
    const initialState = {
      ...getInitialState(),
      services: [createService('test-instance')]
    };

    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_CREATE_FAILURE,
      error: 'service binding test error'
    });
    expect(newState.isCreating).toBe(false);
    expect(newState.services).toHaveLength(1);
    expect(newState.services[0].serviceBindings).toHaveLength(0);
    expect(newState.errors).toHaveLength(1);
    expect(newState.errors[0]).toEqual({ error: 'service binding test error', type: 'create' });
  });
});

describe('Delete Binding', () => {
  it('test delete request', () => {
    const initialState = { ...getInitialState() };
    const newState = serviceBindingReducer(initialState, { type: SERVICE_BINDING_DELETE_REQUEST });
    expect(newState).toEqual({ ...initialState, isDeleting: true });
    expect(initialState).toEqual(defaultState);
  });

  it('test delete success', () => {
    const initialState = {
      ...getInitialState(),
      services: [createService('test-instance', 'test-binding1')]
    };

    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_DELETE_SUCCESS,
      result: { name: 'test-binding1' }
    });
    expect(newState.isDeleting).toBe(false);
    expect(newState.services).toHaveLength(1);
    const [service] = newState.services;
    expect(service.serviceBindings).toHaveLength(1);
    expect(service.isBindingOperationInProgress()).toBe(true);
    expect(service.serviceBindings[0].getCurrentOperation()).toBe('Unbinding');
  });

  it('test delete failure', () => {
    const initialState = {
      ...getInitialState(),
      services: [createService('test-instance')]
    };

    const newState = serviceBindingReducer(initialState, {
      type: SERVICE_BINDING_DELETE_FAILURE,
      error: 'service unbinding test error'
    });
    expect(newState.isDeleting).toBe(false);
    expect(newState.services).toHaveLength(1);
    expect(newState.errors).toHaveLength(1);
    expect(newState.errors[0]).toEqual({ error: 'service unbinding test error', type: 'delete' });
  });
});
