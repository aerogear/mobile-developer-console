import { filter, find } from 'lodash-es';
import { DISMISS_ERROR, DISMISS_ALL_ERRORS, ERROR } from '../actions/errors';

const defaultState = {
  errors: []
};

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case DISMISS_ERROR: {
      const errors = filter(state.errors, err => err.message !== action.errorMessage);
      return {
        errors
      };
    }
    case DISMISS_ALL_ERRORS:
      return {
        errors: []
      };
    case ERROR: {
      const existingErr = find(state.errors, err => err.message === action.errorMessage);
      if (existingErr) {
        return state;
      }
      return {
        errors: [ { message : action.errorMessage }, ...state.errors]
      };
    }
    default:
      return state;
  }
};

export default reducer;
