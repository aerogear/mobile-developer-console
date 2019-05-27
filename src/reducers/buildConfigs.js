import { get as _get, set as _set, cloneDeep, unset } from 'lodash-es';
import {
  BUILD_CONFIGS_REQUEST,
  BUILD_CONFIGS_SUCCESS,
  BUILD_CONFIGS_FAILURE,
  BUILD_CONFIG_DELETE_REQUEST,
  BUILD_CONFIG_DELETE_SUCCESS,
  BUILD_CONFIG_DELETE_FAILURE,
  BUILD_CONFIG_CREATE_REQUEST,
  BUILD_CONFIG_CREATE_SUCCESS,
  BUILD_CONFIG_CREATE_FAILURE,
  BUILD_CONFIG_UPDATE_SUCCESS,
  BUILD_CONFIG_FIELD_SET_VALUE,
  BUILD_CONFIG_FIELD_SET_UI_STATE,
  BUILD_CONFIG_FIELD_REMOVE_VALUE,
  BUILD_CONFIG_CLEAR_STATE
} from '../actions/buildConfigs';
import resourceReducer from './resource';
import {
  ofValidation,
  PATH_CR_SOURCE,
  KEY_CR_SOURCE_GITURL,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  PATH_CR_SOURCE_BASIC_AUTH,
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  KEY_CR_BASIC_AUTH_USERNAME,
  PATH_CR_SOURCE_SSH_AUTH,
  KEY_CR_SSH_AUTH_NAME,
  KEY_CR_SSH_PRIVATE_KEY,
  KEY_CR,
  KEY_CR_NAME,
  withPath,
  KEY_UI,
  KEY_CR_SOURCE,
  KEY_CR_SOURCE_AUTH_TYPE,
  BUILD_AUTH_TYPE_PUBLIC,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_BUILD,
  KEY_CR_BUILD_PLATFORM,
  BUILD_PLATFORM_ANDROID,
  KEY_CR_BUILD_TYPE,
  BUILD_TYPE_DEBUG,
  BUILD_AUTH_TYPE_BASIC,
  BUILD_AUTH_TYPE_SSH
} from '../components/build/Constants';

const buildConfigs = resourceReducer({
  createRequest: BUILD_CONFIG_CREATE_REQUEST,
  createSuccess: BUILD_CONFIG_CREATE_SUCCESS,
  createFailure: BUILD_CONFIG_CREATE_FAILURE,
  listRequest: BUILD_CONFIGS_REQUEST,
  listSuccess: BUILD_CONFIGS_SUCCESS,
  listFailure: BUILD_CONFIGS_FAILURE,
  deleteRequest: BUILD_CONFIG_DELETE_REQUEST,
  deleteSuccess: BUILD_CONFIG_DELETE_SUCCESS,
  deleteFailure: BUILD_CONFIG_DELETE_FAILURE,
  updateSuccess: BUILD_CONFIG_UPDATE_SUCCESS
});

const initialState = {
  config: {
    [KEY_CR_SOURCE]: {
      [KEY_CR_SOURCE_AUTH_TYPE]: BUILD_AUTH_TYPE_PUBLIC,
      [KEY_CR_SOURCE_GITREF]: 'master',
      [KEY_CR_SOURCE_JENKINS_FILE_PATH]: './'
    },
    [KEY_CR_BUILD]: { [KEY_CR_BUILD_PLATFORM]: BUILD_PLATFORM_ANDROID, [KEY_CR_BUILD_TYPE]: BUILD_TYPE_DEBUG }
  },
  validation: {
    config: {},
    mandatoryFields: {
      [KEY_CR]: { fields: [KEY_CR_NAME] },
      [PATH_CR_SOURCE]: { fields: [KEY_CR_SOURCE_GITURL, KEY_CR_SOURCE_GITURL, KEY_CR_SOURCE_JENKINS_FILE_PATH] },
      [PATH_CR_SOURCE_BASIC_AUTH]: {
        fields: [KEY_CR_BASIC_AUTH_NAME, KEY_CR_BASIC_AUTH_PASSWORD, KEY_CR_BASIC_AUTH_USERNAME],
        affectsFun: state => _get(state, withPath(PATH_CR_SOURCE, KEY_CR_SOURCE_AUTH_TYPE)) === BUILD_AUTH_TYPE_BASIC
      },
      [PATH_CR_SOURCE_SSH_AUTH]: {
        fields: [KEY_CR_SSH_AUTH_NAME, KEY_CR_SSH_PRIVATE_KEY],
        affectsFun: state => _get(state, withPath(PATH_CR_SOURCE, KEY_CR_SOURCE_AUTH_TYPE)) === BUILD_AUTH_TYPE_SSH
      }
    }
  },
  ui: {}
};

/**
 * Reducer for BuildConfig dialog functionality */
export const buildConfigReducer = (prevState = initialState, action) => {
  switch (action.type) {
    case BUILD_CONFIG_FIELD_SET_VALUE: {
      const state = cloneDeep(prevState);
      const { path, name, value, valid } = action.payload;
      _set(state, `${path}.${name}`, value);
      _set(state, ofValidation(`${path}.${name}`), valid);
      return state;
    }
    case BUILD_CONFIG_FIELD_SET_UI_STATE: {
      const state = cloneDeep(prevState);
      const { name, value } = action.payload;
      _set(state, withPath(KEY_UI, name), value);
      return state;
    }
    case BUILD_CONFIG_FIELD_REMOVE_VALUE: {
      const state = cloneDeep(prevState);
      const { path, values } = action.payload;
      values.forEach(name => {
        const field = `${path}.${name}`;
        unset(state, field);
        unset(state, ofValidation(field));
      });
      return state;
    }
    case BUILD_CONFIG_CLEAR_STATE: {
      return cloneDeep(initialState);
    }
    default:
      return prevState;
  }
};

export default buildConfigs;
