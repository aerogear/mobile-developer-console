import {
  BUILDS_REQUEST,
  BUILDS_SUCCESS,
  BUILDS_FAILURE,
  BUILD_TRIGGER_REQUEST,
  BUILD_TRIGGER_SUCCESS,
  BUILD_TRIGGER_FAILURE,
  BUILD_DOWNLOAD_REQUEST,
  BUILD_DOWNLOAD_SUCCESS,
  BUILD_DOWNLOAD_FAILURE,
  BUILDS_MODIFIED_SUCCESS,
  BUILDS_DELETE_SUCCESS
} from '../actions/builds';
import resourceReducer from './resource';

const builds = resourceReducer({
  listRequest: BUILDS_REQUEST,
  listSuccess: BUILDS_SUCCESS,
  listFailure: BUILDS_FAILURE,
  createRequest: BUILD_TRIGGER_REQUEST,
  createSuccess: BUILD_TRIGGER_SUCCESS,
  createFailure: BUILD_TRIGGER_FAILURE,
  actionRequest: BUILD_DOWNLOAD_REQUEST,
  actionSuccess: BUILD_DOWNLOAD_SUCCESS,
  actionFailure: BUILD_DOWNLOAD_FAILURE,
  updateSuccess: BUILDS_MODIFIED_SUCCESS,
  deleteSuccess: BUILDS_DELETE_SUCCESS
});

export default builds;
