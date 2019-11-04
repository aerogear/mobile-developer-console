import { find, filter, cloneDeep } from 'lodash-es';
import {
  SERVICES_REQUEST,
  SERVICES_SUCCESS,
  SERVICES_FAILURE,
  CUSTOM_RESOURCE_LIST_SUCCESS,
  CUSTOM_RESOURCE_ADDED_SUCCESS,
  CUSTOM_RESOURCE_DELETED_SUCCESS,
  CUSTOM_RESOURCE_MODIFIED_SUCCESS
} from '../actions/services';

const defaultState = {
  isFetching: false,
  items: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false
};

function addOrReplaceItem(array = [], item, predicate) {
  const index = array.findIndex(predicate);
  if (index >= 0) {
    return [...array.slice(0, index), item, ...array.slice(index + 1)];
  }
  return [...array, item];
}

function sameService(oldService, newService) {
  return oldService.name === newService.name;
}

function sameCustomResource(oldCR, newCR) {
  return oldCR.metadata.name === newCR.metadata.name;
}

const resourceReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SERVICES_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case SERVICES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        items: action.result.items
      };
    case SERVICES_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    case CUSTOM_RESOURCE_LIST_SUCCESS: {
      const { service, items } = action;
      service.customResources = items;
      return {
        ...state,
        items: addOrReplaceItem(state.items, service, item => sameService(item, service))
      };
    }
    case CUSTOM_RESOURCE_ADDED_SUCCESS:
    case CUSTOM_RESOURCE_MODIFIED_SUCCESS: {
      const { service, result } = action;

      const items = cloneDeep(state.items); // to avoid changing the 'customResources' of the original state
      const existingService = find(items, s => sameService(s, service));
      if (existingService) {
        existingService.customResources = addOrReplaceItem(existingService.customResources, result, c =>
          sameCustomResource(c, result)
        );
      }
      return {
        ...state,
        items
      };
    }
    case CUSTOM_RESOURCE_DELETED_SUCCESS: {
      const { service, result } = action;
      const existingService = find(state.items, s => sameService(s, service));
      if (existingService) {
        existingService.customResources = filter(existingService.customResources, c => !sameCustomResource(c, result));
      }
      return {
        ...state
      };
    }
    default:
      return state;
  }
};

export default resourceReducer;
