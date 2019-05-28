import {
  APPS_REQUEST,
  APPS_SUCCESS,
  APPS_FAILURE,
  APP_REQUEST,
  APP_SUCCESS,
  APP_FAILURE,
  APP_CREATE_REQUEST,
  APP_CREATE_SUCCESS,
  APP_CREATE_FAILURE,
  APP_DELETE_REQUEST,
  APP_DELETE_SUCCESS,
  APP_DELETE_FAILURE,
  APP_UPDATE_REQUEST,
  APP_UPDATE_SUCCESS,
  APP_UPDATE_FAILURE,
  APP_CONFIG_REQUEST,
  APP_CONFIG_SUCCESS,
  APP_CONFIG_FAILURE
} from '../actions/apps';
import resourceReducer from './resource';

const defaultAppConfigs = {
  items: [],
  isFetching: false
};

const apps = resourceReducer({
  listRequest: APPS_REQUEST,
  listSuccess: APPS_SUCCESS,
  listFailure: APPS_FAILURE,
  readRequest: APP_REQUEST,
  readSuccess: APP_SUCCESS,
  readFailure: APP_FAILURE,
  createRequest: APP_CREATE_REQUEST,
  createSuccess: APP_CREATE_SUCCESS,
  createFailure: APP_CREATE_FAILURE,
  updateRequest: APP_UPDATE_REQUEST,
  updateSuccess: APP_UPDATE_SUCCESS,
  updateFailure: APP_UPDATE_FAILURE,
  deleteRequest: APP_DELETE_REQUEST,
  deleteSuccess: APP_DELETE_SUCCESS,
  deleteFailure: APP_DELETE_FAILURE
});

const appConfigs = (state = defaultAppConfigs, action) => {
  switch (action.type) {
    case APP_CONFIG_REQUEST:
      return {
        ...state,
        isFetching: true
      };
    case APP_CONFIG_SUCCESS: {
      const appname = action.result.clientId;
      const index = state.items.findIndex(item => item.clientId === appname);
      if (index >= 0) {
        return {
          ...state,
          isFetching: false,
          items: [...state.items.slice(0, index), action.result, ...state.items.slice(index + 1)]
        };
      }
      return {
        ...state,
        items: [...state.items, action.result]
      };
    }
    case APP_CONFIG_FAILURE:
      return {
        ...state,
        isFetching: false
      };
    default:
      return state;
  }
};

export { apps, appConfigs };
