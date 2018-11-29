import { findIndex } from 'lodash-es';

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
    case SERVICE_BINDINGS_SUCCESS: {
      return {
        ...state,
        isReading: false,
        errors: getErrors(null, 'read', state.errors),
        boundServices: action.result.boundServices,
        unboundServices: action.result.unboundServices
      };
    }
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
    case SERVICE_BINDING_CREATE_SUCCESS: {
      const { serviceInstanceName } = action.result;
      const indexOfUnboundService = findIndex(
        state.unboundServices,
        binding => binding.getServiceInstanceName() === serviceInstanceName
      );

      // we support multiple bindings to a service
      // so, we need to check if the service that the "create binding" request is sent is a
      // bound one already or an unbound one.
      // our target is to mark the service as "binding in progress"

      if (indexOfUnboundService >= 0) {
        const newState = {
          ...state,
          isCreating: false,
          unboundServices: [
            ...state.unboundServices.slice(0, indexOfUnboundService),
            state.unboundServices[indexOfUnboundService].bind(),
            ...state.unboundServices.slice(indexOfUnboundService + 1)
          ],
          errors: getErrors(null, 'create', state.errors)
        };

        return newState;
      } else {
        const indexOfBoundService = findIndex(
          state.boundServices,
          binding => binding.getServiceInstanceName() === serviceInstanceName
        );

        const newState = {
          ...state,
          isCreating: false,
          boundServices: [
            ...state.boundServices.slice(0, indexOfBoundService),
            state.boundServices[indexOfBoundService].markBindInProgress(),
            ...state.boundServices.slice(indexOfBoundService + 1)
          ],
          errors: getErrors(null, 'create', state.errors)
        };

        return newState;
      }
    }
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
      const deletedBindingName = action.result;
      const index = findIndex(state.boundServices, item => item.getBindingName() === deletedBindingName);
      return {
        ...state,
        isDeleting: false,
        boundServices: [...state.boundServices.slice(0, index), ...state.boundServices.slice(index + 1)], // TODO: what about multiple binding support?
        unboundServices: [...state.unboundServices, state.boundServices[index].unbind()], // TODO: what about multiple binding support?
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
