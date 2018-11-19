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

const defaultState = {
  isFetching: false,
  boundServices: [],
  unboundServices: [],
  errors: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false
};

const getErrors = (error, type, errors) => {
  const index = errors.findIndex(e => e.type === type);
  if (!error) {
    if (index >= 0) {
      return [...errors.slice(0, index), ...errors.slice(index + 1)];
    }
    return errors;
  }
  if (index >= 0) {
    return [...errors.slice(0, index), { error, type }, ...errors.slice(index + 1)];
  }
  return [{ error, type }, ...errors];
};

const serviceBindingsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SERVICE_BINDINGS_REQUEST:
      return {
        ...state,
        isReading: true
      };
    case SERVICE_BINDINGS_SUCCESS:
      return {
        ...state,
        isReading: false,
        errors: getErrors(null, 'read', state.errors),
        boundServices: action.result.boundServices,
        unboundServices: action.result.unboundServices
      };
    case SERVICE_BINDINGS_FAILURE:
      return {
        ...state,
        isReading: false,
        errors: getErrors(action.error, 'read', state.errors)
      };
    case SERVICE_BINDING_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true
      };
    case SERVICE_BINDING_CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        errors: getErrors(null, 'create', state.errors),
      };
    case SERVICE_BINDING_CREATE_FAILURE:
      return {
        ...state,
        isCreating: false,
        errors: getErrors(action.error, 'create', state.errors)
      };
    case SERVICE_BINDING_DELETE_REQUEST:
      return {
        ...state,
        isDeleting: true
      };
    case SERVICE_BINDING_DELETE_SUCCESS: {
      return {
        ...state,
        isDeleting: false,
        errors: getErrors(null, 'delete', state.errors)
      };
    }
    case SERVICE_BINDING_DELETE_FAILURE:
      return {
        ...state,
        isDeleting: false,
        errors: getErrors(action.error, 'delete', state.errors)
      };
    default:
      return state;
  }
};

export default serviceBindingsReducer;
