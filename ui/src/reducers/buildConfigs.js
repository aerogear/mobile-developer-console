import {
  BUILD_CONFIGS_REQUEST,
  BUILD_CONFIGS_SUCCESS,
  BUILD_CONFIGS_FAILURE,
  BUILD_CONFIG_DELETE_REQUEST,
  BUILD_CONFIG_DELETE_SUCCESS,
  BUILD_CONFIG_DELETE_FAILURE,
} from '../actions/buildConfigs';
import resourceReducer from './resource';

const buildConfigs = resourceReducer({
  listRequest: BUILD_CONFIGS_REQUEST,
  listSuccess: BUILD_CONFIGS_SUCCESS,
  listFailure: BUILD_CONFIGS_FAILURE,
  deleteRequest: BUILD_CONFIG_DELETE_REQUEST,
  deleteSuccess: BUILD_CONFIG_DELETE_SUCCESS,
  deleteFailure: BUILD_CONFIG_DELETE_FAILURE,
});

export default buildConfigs;
