import {
  USER_INFO_REQUEST,
  USER_INFO_SUCCESS,
  USER_INFO_FAILURE
} from '../actions/users';

const defaultState = {
  currentUser: {name: "Unknown"},
  loading: false,
  loadError: false
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
    default:
      return state;
  }
};

export default user;