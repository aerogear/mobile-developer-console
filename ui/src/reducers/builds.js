import {
  BUILDS_REQUEST,
  BUILDS_SUCCESS,
  BUILDS_FAILURE,
  BUILD_TRIGGER_REQUEST,
  BUILD_TRIGGER_SUCCESS,
  BUILD_TRIGGER_FAILURE,
} from '../actions/builds';
import resourceReducer from './resource';

const builds = resourceReducer({
  listRequest: BUILDS_REQUEST,
  listSuccess: BUILDS_SUCCESS,
  listFailure: BUILDS_FAILURE,
  createRequest: BUILD_TRIGGER_REQUEST,
  createSuccess: BUILD_TRIGGER_SUCCESS,
  createFailure: BUILD_TRIGGER_FAILURE,
});

export default builds;
