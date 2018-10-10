import {
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
  USER_INFO_FAILURE,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_LOGOUT_FAILURE  
} from '../actions/users';

const defaultState = {
  currentUser: {name: "Unknown"},
  loading: false,
  loadError: false,
  loggingOut: false,
  logoutError: false
};

const user = (state = defaultState, action) => {
  switch (action.type) {
    case USER_INFO_REQUEST:
      return {
        ...state,
        loading: true,
        loadError: false
      };
    case USER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loadError: false,
        currentUser: action.result
      };
    case USER_INFO_FAILURE:
      return {
        ...state,
        loading: false,
        loadError: action.error,
        currentUser: null
      };
    case USER_LOGOUT_REQUEST:
      return {
        ...state,
        loggingOut: true,
        logoutError: false
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        logoutError: false,
        currentUser: null
      };
    case USER_LOGOUT_FAILURE:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
};

export default user;