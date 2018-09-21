import {
  BUILDS_REQUEST,
  BUILDS_SUCCESS,
  BUILDS_FAILURE,
} from '../actions/builds';
import resourceReducer from './resource';

const builds = resourceReducer({
  listRequest: BUILDS_REQUEST,
  listSuccess: BUILDS_SUCCESS,
  listFailure: BUILDS_FAILURE,
});

export default builds;
