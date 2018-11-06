import {
  APP_PLATFORM_REGISTER,
  APP_PLATFORM_SELECT,
  APP_FORM_SETSTATUS,
  APP_FORM_RESET,
  APP_FIELD_SETVALUE
} from '../actions/apps';
import { DISMISS_ERROR, DISMISS_ALL_ERRORS } from '../actions/errors';
import { wsError } from '../DataService';

const defaultState = {
  isFetching: false,
  items: [],
  errors: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false,
  createClientAppDialog: {
    platforms: {},
    fields: {}
  }
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

const resourceReducer = actions => (state = defaultState, action) => {
  let index;
  let errorsToDismiss;
  let errors;
  switch (action.type) {
    case DISMISS_ERROR:
      if (action.errorMessage === wsError.message) {
        delete wsError.message;
      }
      errorsToDismiss = state.errors.filter(e => e.error.message === action.errorMessage);
      errors = [...state.errors];
      errorsToDismiss.forEach(e => {
        index = errors.findIndex(err => err === e);
        errors = [...errors.slice(0, index), ...errors.slice(index + 1)];
      });
      return {
        ...state,
        errors
      };
    case DISMISS_ALL_ERRORS:
      delete wsError.message;
      return {
        ...state,
        errors: []
      };
    case actions.listRequest:
      return {
        ...state,
        isFetching: true
      };
    case actions.listSuccess:
      return {
        ...state,
        isFetching: false,
        items: action.result,
        errors: getErrors(null, 'list', state.errors)
      };
    case actions.listFailure:
      return {
        ...state,
        isFetching: false,
        errors: getErrors(action.error, 'list', state.errors)
      };
    case actions.readRequest:
      return {
        ...state,
        isReading: true
      };
    case actions.readSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      if (index >= 0) {
        return {
          ...state,
          isReading: false,
          items: [...state.items.slice(0, index), action.result, ...state.items.slice(index + 1)],
          errors: getErrors(null, 'read', state.errors)
        };
      }
      return {
        ...state,
        isReading: false,
        items: [...state.items, action.result],
        errors: getErrors(null, 'read', state.errors)
      };
    case actions.readFailure:
      return {
        ...state,
        isReading: false,
        errors: getErrors(action.error, 'read', state.errors)
      };
    case actions.createRequest:
      return {
        ...state,
        isCreating: true
      };
    case actions.createSuccess:
      return {
        ...state,
        isCreating: false,
        errors: getErrors(null, 'create', state.errors),
        items: [...state.items, action.result]
      };
    case actions.createFailure:
      return {
        ...state,
        isCreating: false,
        errors: getErrors(action.error, 'create', state.errors)
      };
    case actions.updateRequest:
      return {
        ...state,
        isUpdating: true,
        updateError: false,
      };
    case actions.updateSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      return {
        ...state,
        isUpdating: false,
        updateError: false,
        items: [
          ...state.items.slice(0, index),
          action.result,
          ...state.items.slice(index + 1),
        ],
      };
    case actions.updateFailure:
      return {
        ...state,
        isUpdating: false,
        updateError: action.error,
      };
    case actions.deleteRequest:
      return {
        ...state,
        isDeleting: true
      };
    case actions.deleteSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result);
      return {
        ...state,
        isDeleting: false,
        errors: getErrors(null, 'delete', state.errors),
        items: [...state.items.slice(0, index), ...state.items.slice(index + 1)]
      };
    case actions.deleteFailure:
      return {
        ...state,
        isDeleting: false,
        errors: getErrors(action.error, 'delete', state.errors)
      };
    case actions.actionRequest:
      return {
        ...state,
        isActioning: true
      };
    case actions.actionSuccess:
      return {
        ...state,
        isActioning: false,
        errors: getErrors(null, 'action', state.errors)
      };
    case actions.actionFailure:
      return {
        ...state,
        isActioning: false,
        errors: getErrors(action.error, 'action', state.errors)
      };
    default:
      return createClientAppDialog(state, action);
  }
};

/**
 * Reducers for the create client app dialog.
 * @param {string} state
 * @param {*} action
 */
function createClientAppDialog(state, action) {
  switch (action.type) {
    case APP_FORM_RESET:
      return {
        ...state,
        createClientAppDialog: {
          platforms: state.createClientAppDialog.platforms,
          fields: {}
        }
      };
    case APP_PLATFORM_REGISTER:
      var newState = { ...state };
      if (!newState.createClientAppDialog.platforms[action.platform.name]) {
        newState.createClientAppDialog.platforms[action.platform.name] = { selected: false };
      }
      return newState;
    case APP_PLATFORM_SELECT:
      var selectedPlatform = action.platform.name;
      var newPlatformState = JSON.parse(JSON.stringify(state.createClientAppDialog.platforms));
      for (var platform in newPlatformState) {
        newPlatformState[platform] = { selected: platform === selectedPlatform };
      }

      return {
        ...state,
        createClientAppDialog: { ...state.createClientAppDialog, platforms: newPlatformState }
      }
    case APP_FORM_SETSTATUS:
      if (state.createClientAppDialog.valid === action.payload.status) {
        return state;
      }
      return {
        ...state,
        createClientAppDialog: { ...state.createClientAppDialog, valid: action.payload.status }
      }
    case APP_FIELD_SETVALUE:
      return {
        ...state,
        createClientAppDialog: {
          ...state.createClientAppDialog,
          fields: {
            ...state.createClientAppDialog.fields,
            [action.payload.name]: { value: action.payload.value, valid: action.payload.valid }
          }
        }
      }
    default:
      return state;
  }
}



export default resourceReducer;
