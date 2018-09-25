import { BUILD_CONFIGS_REQUEST, BUILD_CONFIGS_SUCCESS, BUILD_CONFIGS_FAILURE } from '../actions/buildConfigs';
import resourceReducer from './resource';

const buildConfigs = resourceReducer({
  listRequest: BUILD_CONFIGS_REQUEST,
  listSuccess: BUILD_CONFIGS_SUCCESS,
  listFailure: BUILD_CONFIGS_FAILURE
});

export default buildConfigs;
