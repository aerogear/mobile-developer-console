import DataService from '../DataService';
import fetchAction from './fetch';

export const BUILD_CONFIGS_REQUEST = 'BUILD_CONFIGS_REQUEST';
export const BUILD_CONFIGS_SUCCESS = 'BUILD_CONFIGS_SUCCESS';
export const BUILD_CONFIGS_FAILURE = 'BUILD_CONFIGS_FAILURE';

export const fetchBuildConfigs = fetchAction(
  [BUILD_CONFIGS_REQUEST, BUILD_CONFIGS_SUCCESS, BUILD_CONFIGS_FAILURE],
  DataService.buildConfigs
);
