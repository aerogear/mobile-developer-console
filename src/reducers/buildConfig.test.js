import _, { get as _get } from 'lodash';
import { buildConfigReducer as buildConfigDialogReducer } from './buildConfigs';

import {
  BUILD_CONFIG_FIELD_SET_VALUE,
  BUILD_CONFIG_FIELD_SET_UI_STATE,
  BUILD_CONFIG_FIELD_REMOVE_VALUE,
  BUILD_CONFIG_CLEAR_STATE
} from '../actions/buildConfigs';
import {
  BUILD_AUTH_TYPE_BASIC,
  BUILD_AUTH_TYPE_PUBLIC,
  BUILD_AUTH_TYPE_SSH,
  BUILD_PLATFORM_ANDROID,
  BUILD_TYPE_DEBUG,
  KEY_CR,
  KEY_CR_BASIC_AUTH_NAME,
  KEY_CR_BASIC_AUTH_PASSWORD,
  KEY_CR_BASIC_AUTH_USERNAME,
  KEY_CR_BUILD,
  KEY_CR_BUILD_PLATFORM,
  KEY_CR_BUILD_TYPE,
  KEY_CR_NAME,
  KEY_CR_SOURCE,
  KEY_CR_SOURCE_AUTH_TYPE,
  KEY_CR_SOURCE_GITREF,
  KEY_CR_SOURCE_GITURL,
  KEY_CR_SOURCE_JENKINS_FILE_PATH,
  KEY_CR_SSH_AUTH_NAME,
  KEY_CR_SSH_PRIVATE_KEY,
  KEY_UI,
  PATH_CR_SOURCE,
  PATH_CR_SOURCE_BASIC_AUTH,
  PATH_CR_SOURCE_SSH_AUTH,
  withPath
} from '../components/build/Constants';

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

// Test variables
const TESTROOT = 'testRoot';
const TESTSUBTREE = 'testSubTree';
const TESTKEY1 = 'testKey1';
const TESTVALUE1 = 'testValue1';
const TESTKEY2 = 'testKey2';
const TESTVALUE2 = 'testValue2';
const TESTKEY3 = 'testKey3';
const TESTVALUE3 = 'testValue3';

describe('buildConfig Dialog Reducer', () => {
  it('test config field set value', () => {
    const state = _.cloneDeep(initialState);
    let res = buildConfigDialogReducer(state, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY1}`, value: `${TESTVALUE1}`, valid: true }
    });
    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY2}`, value: `${TESTVALUE2}`, valid: false }
    });
    expect(res[TESTROOT][TESTSUBTREE]).toEqual({ [TESTKEY1]: `${TESTVALUE1}`, [TESTKEY2]: `${TESTVALUE2}` });
    expect(res.validation[TESTROOT][TESTSUBTREE]).toEqual({ [TESTKEY1]: true, [TESTKEY2]: false });
    expect(initialState).toEqual(state); // Original state must be unchanged
  });
  it('test config field remove value', () => {
    const state = _.cloneDeep(initialState);
    let res = buildConfigDialogReducer(state, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY1}`, value: `${TESTVALUE1}`, valid: true }
    });
    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY2}`, value: `${TESTVALUE2}`, valid: false }
    });
    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY3}`, value: `${TESTVALUE3}`, valid: false }
    });
    expect(res[TESTROOT][TESTSUBTREE]).toEqual({
      [TESTKEY1]: `${TESTVALUE1}`,
      [TESTKEY2]: `${TESTVALUE2}`,
      [TESTKEY3]: `${TESTVALUE3}`
    });
    expect(res.validation[TESTROOT][TESTSUBTREE]).toEqual({ [TESTKEY1]: true, [TESTKEY2]: false, [TESTKEY3]: false });

    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_REMOVE_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, values: [TESTKEY1, TESTKEY2] }
    });

    expect(res[TESTROOT][TESTSUBTREE]).toEqual({ [TESTKEY3]: `${TESTVALUE3}` });
    expect(res.validation[TESTROOT][TESTSUBTREE]).toEqual({ [TESTKEY3]: false });

    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_REMOVE_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, values: [TESTKEY1, TESTKEY2, TESTKEY3] }
    });

    expect(res[TESTROOT][TESTSUBTREE]).toEqual({});

    expect(initialState).toEqual(state); // Original state must be unchanged
  });
  it('test config set ui state', () => {
    const state = _.cloneDeep(initialState);
    let res = buildConfigDialogReducer(state, {
      type: BUILD_CONFIG_FIELD_SET_UI_STATE,
      payload: { name: `${TESTKEY1}`, value: `${TESTVALUE1}` }
    });

    expect(res[KEY_UI]).toEqual({ [TESTKEY1]: TESTVALUE1 });

    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_SET_UI_STATE,
      payload: { name: `${TESTKEY2}`, value: `${TESTVALUE2}` }
    });

    expect(res[KEY_UI]).toEqual({ [TESTKEY1]: TESTVALUE1, [TESTKEY2]: TESTVALUE2 });

    expect(initialState).toEqual(state); // Original state must be unchanged
  });
  it('test clear all', () => {
    const state = _.cloneDeep(initialState);
    let res = buildConfigDialogReducer(state, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY1}`, value: `${TESTVALUE1}`, valid: true }
    });
    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY2}`, value: `${TESTVALUE2}`, valid: false }
    });
    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_FIELD_SET_VALUE,
      payload: { path: `${TESTROOT}.${TESTSUBTREE}`, name: `${TESTKEY3}`, value: `${TESTVALUE3}`, valid: false }
    });
    expect(res[TESTROOT][TESTSUBTREE]).toEqual({
      [TESTKEY1]: `${TESTVALUE1}`,
      [TESTKEY2]: `${TESTVALUE2}`,
      [TESTKEY3]: `${TESTVALUE3}`
    });
    expect(res.validation[TESTROOT][TESTSUBTREE]).toEqual({ [TESTKEY1]: true, [TESTKEY2]: false, [TESTKEY3]: false });

    res = buildConfigDialogReducer(res, {
      type: BUILD_CONFIG_CLEAR_STATE
    });

    // json.parse/stringify needed to avoid equality check fail due to different, non human visible, properties.
    expect(JSON.parse(JSON.stringify(res))).toEqual(JSON.parse(JSON.stringify(initialState)));
  });
});
