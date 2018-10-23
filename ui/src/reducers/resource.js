import {
  APP_PLATFORM_REGISTER,
  APP_PLATFORM_SELECT,
  APP_FORM_SETSTATUS,
  APP_FORM_RESET,
  APP_FIELD_SETVALUE
} from "../actions/apps";

const defaultState = {
  isFetching: false,
  items: [],
  fetchError: false,
  isCreating: false,
  createError: false,
  isDeleting: false,
  deleteError: false,
  isActioning: false,
  actionError: false,
  isReading: false,
  readingError: false,
  createClientAppDialog: {
    platforms: {},
    fields: {}
  }
};

const resourceReducer = actions => (state = defaultState, action) => {
  let index;
  switch (action.type) {
    case actions.listRequest:
      return {
        ...state,
        isFetching: true,
        fetchError: false,
      };
    case actions.listSuccess:
      return {
        ...state,
        isFetching: false,
        items: action.result,
        fetchError: false,
      };
    case actions.listFailure:
      return {
        ...state,
        isFetching: false,
        fetchError: action.error,
      };
    case actions.readRequest:
      return {
        ...state,
        isReading: true,
        readingError: false,
      };
    case actions.readSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      if (index >= 0) {
        return {
          ...state,
          isReading: false,
          items: [
            ...state.items.slice(0, index),
            action.result,
            ...state.items.slice(index + 1),
          ],
          readingError: false,
        };
      } else {
        return {
          ...state,
          isReading: false,
          items: [...state.items, action.result],
          readingError: false,
        };
      }
    case actions.readFailure:
      return {
        ...state,
        isReading: false,
        readingError: action.error,
      };
    case actions.createRequest:
      return {
        ...state,
        isCreating: true,
        createError: false,
      };
    case actions.createSuccess:
      return {
        ...state,
        isCreating: false,
        createError: false,
        items: [...state.items, action.result],
      };
    case actions.createFailure:
      return {
        ...state,
        isCreating: false,
        createError: action.error,
      };
    case actions.deleteRequest:
      return {
        ...state,
        isDeleting: true,
        deleteError: false,
      };
    case actions.deleteSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result);
      return {
        ...state,
        isDeleting: false,
        deleteError: false,
        items: [
          ...state.items.slice(0, index),
          ...state.items.slice(index + 1),
        ],
      };
    case actions.deleteFailure:
      return {
        ...state,
        isDeleting: false,
        deleteError: action.error,
      };
    case actions.actionRequest:
      return {
        ...state,
        isActioning: true,
        actionError: false,
      };
    case actions.actionSuccess:
      return {
        ...state,
        isActioning: false,
        actionError: false,
      };
    case actions.actionFailure:
      return {
        ...state,
        isActioning: false,
        actionError: action.error,
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
