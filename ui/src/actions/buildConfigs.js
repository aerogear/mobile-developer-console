import DataService from '../DataService';
import fetchAction from './fetch';

export const BUILD_CONFIGS_REQUEST = 'BUILD_CONFIGS_REQUEST';
export const BUILD_CONFIGS_SUCCESS = 'BUILD_CONFIGS_SUCCESS';
export const BUILD_CONFIGS_FAILURE = 'BUILD_CONFIGS_FAILURE';

export const fetchBuildConfigs = fetchAction(
  [BUILD_CONFIGS_REQUEST, BUILD_CONFIGS_SUCCESS, BUILD_CONFIGS_FAILURE],
  DataService.buildConfigs,
);

export const BUILD_CONFIG_DELETE_REQUEST = 'BUILD_CONFIG_DELETE_REQUEST';
export const BUILD_CONFIG_DELETE_SUCCESS = 'BUILD_CONFIG_DELETE_SUCCESS';
export const BUILD_CONFIG_DELETE_FAILURE = 'BUILD_CONFIG_DELETE_FAILURE';

export const deleteBuildConfig = name => fetchAction(
  [BUILD_CONFIG_DELETE_REQUEST, BUILD_CONFIG_DELETE_SUCCESS, BUILD_CONFIG_DELETE_FAILURE],
  async () => DataService.deleteBuildConfig(name),
)();

export const BUILD_CONFIG_CREATE_REQUEST = 'BUILD_CONFIG_CREATE_REQUEST';
export const BUILD_CONFIG_CREATE_SUCCESS = 'BUILD_CONFIG_CREATE_SUCCESS';
export const BUILD_CONFIG_CREATE_FAILURE = 'BUILD_CONFIG_CREATE_FAILURE';

export const createBuildConfig = config => fetchAction(
  [BUILD_CONFIG_CREATE_REQUEST, BUILD_CONFIG_CREATE_SUCCESS, BUILD_CONFIG_CREATE_FAILURE],
  async () => DataService.createBuildConfig(config),
)();
