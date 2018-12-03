import { findIndex, map } from 'lodash-es';
import { MobileService, ServiceBinding } from '../models';

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
  services: [],
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
      const services = map(action.result, data => new MobileService(data));
      return {
        ...state,
        isReading: false,
        errors: getErrors(null, 'read', state.errors),
        services
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
      const serviceIndex = findIndex(
        state.services,
        service => service.getServiceInstanceName() === serviceInstanceName
      );
      if (serviceIndex > -1) {
        const service = state.services[serviceIndex];
        const newBinding = new ServiceBinding();
        newBinding.bind();
        service.serviceBindings.push(newBinding);

        const newState = {
          ...state,
          isCreating: false,
          services: [...state.services.slice(0, serviceIndex), service, ...state.services.slice(serviceIndex + 1)],
          errors: getErrors(null, 'create', state.errors)
        };

        return newState;
      }
      return state;
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
      const { name } = action.result;
      const serviceIndex = findIndex(state.services, item => item.findBinding(name) != null);
      if (serviceIndex > -1) {
        const service = state.services[serviceIndex];
        const binding = service.findBinding(name);
        binding.unbind();
        return {
          ...state,
          isDeleting: false,
          services: [...state.services.slice(0, serviceIndex), service, ...state.services.slice(serviceIndex + 1)]
        };
      }
      return state;
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
