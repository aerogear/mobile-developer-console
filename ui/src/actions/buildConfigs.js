import DataService from '../DataService';
import fetchAction from './fetch';

export const BUILD_CONFIGS_REQUEST = 'BUILD_CONFIGS_REQUEST';
export const BUILD_CONFIGS_SUCCESS = 'BUILD_CONFIGS_SUCCESS';
export const BUILD_CONFIGS_FAILURE = 'BUILD_CONFIGS_FAILURE';

export const fetchBuildConfigs = fetchAction(
  [BUILD_CONFIGS_REQUEST, BUILD_CONFIGS_SUCCESS, BUILD_CONFIGS_FAILURE],
  DataService.buildConfigs
);

export const BUILD_CONFIG_DELETE_REQUEST = 'BUILD_CONFIG_DELETE_REQUEST';
export const BUILD_CONFIG_DELETE_SUCCESS = 'BUILD_CONFIG_DELETE_SUCCESS';
export const BUILD_CONFIG_DELETE_FAILURE = 'BUILD_CONFIG_DELETE_FAILURE';

export const deleteBuildConfig = name =>
  fetchAction([BUILD_CONFIG_DELETE_REQUEST, BUILD_CONFIG_DELETE_SUCCESS, BUILD_CONFIG_DELETE_FAILURE], async () =>
    DataService.deleteBuildConfig(name)
  )();

export const BUILD_CONFIG_CREATE_REQUEST = 'BUILD_CONFIG_CREATE_REQUEST';
export const BUILD_CONFIG_CREATE_SUCCESS = 'BUILD_CONFIG_CREATE_SUCCESS';
export const BUILD_CONFIG_CREATE_FAILURE = 'BUILD_CONFIG_CREATE_FAILURE';

export const createBuildConfig = config =>
  fetchAction([BUILD_CONFIG_CREATE_REQUEST, BUILD_CONFIG_CREATE_SUCCESS, BUILD_CONFIG_CREATE_FAILURE], async () =>
    DataService.createBuildConfig(config)
  )();

export const BUILD_CONFIG_FIELD_SET_VALUE = 'BUILD_CONFIG_FIELD_SET_VALUE';
export const BUILD_CONFIG_FIELD_REMOVE_VALUE = 'BUILD_CONFIG_FIELD_REMOVE_VALUE';
export const BUILD_CONFIG_FIELD_SET_UI_STATE = 'BUILD_CONFIG_FIELD_SET_UI_STATE';
export const BUILD_CONFIG_CLEAR_STATE = 'BUILD_CONFIG_CLEAR_STATE';

/**
 * Creates action for setting the value of a field into the state
 * @param {path} path part of the build config path
 */
export const createSetBuildConfigValue = (path = null) => (fieldId, value, isValid) => ({
  type: BUILD_CONFIG_FIELD_SET_VALUE,
  payload: { path, name: fieldId, value, valid: isValid }
});

/**
 * Action for setting the UI state
 * @param {fieldId} key
 * @param {value} value
 */
export const setUiState = (fieldId, value) => ({
  type: BUILD_CONFIG_FIELD_SET_UI_STATE,
  payload: { name: fieldId, value }
});

/**
 * Action for removing field from the Build Config
 * @param {string} path path to the field
 * @param {...string} values multiple field names
 */
export const createRemoveValues = (path = null) => (...values) => ({
  type: BUILD_CONFIG_FIELD_REMOVE_VALUE,
  payload: { path, values }
});

/**
 * Clears the state for create build config dialog.
 */
export const clearState = () => ({ type: BUILD_CONFIG_CLEAR_STATE });
