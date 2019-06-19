import _, { get as _get } from 'lodash-es';
import buildConfigsResourceReducer, { buildConfigReducer as buildConfigDialogReducer } from './buildConfigs';

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

const resourceReducerInitialState = {
  isFetching: false,
  items: [],
  isCreating: false,
  isDeleting: false,
  isActioning: false,
  isReading: false,
  fetched: false
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

const ITEM1 = 'ITEM1';
const ITEM2 = 'ITEM2';
const ITEM3 = 'ITEM3';
const TESTITEM1 = { metadata: { name: ITEM1 } };
const TESTITEM2 = { metadata: { name: ITEM2 } };
const TESTITEM3 = { metadata: { name: ITEM3 } };
const TESTITEM1_UPDATE = { metadata: { name: ITEM1, updated: true } };

describe('buildConfig Resource Reducer', () => {
  it('test Config createRequest', () => {
    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, { type: BUILD_CONFIG_CREATE_REQUEST });
    expect(res.isCreating).toBe(true);
    expect(_.omit(state, ['isCreating'])).toEqual(_.omit(res, ['isCreating']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });
  it('test Config createSuccess', () => {
    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, { type: BUILD_CONFIG_CREATE_SUCCESS, result: 'MYITEM' });
    expect(res.isCreating).toBe(false);
    expect(res.items).toEqual(['MYITEM']);
    expect(_.isMatch(res, state)).toBe(true);
    expect(_.omit(state, ['isCreating', 'items'])).toEqual(_.omit(res, ['isCreating', 'items']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });
  it('test Config createFailure', () => {
    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, { type: BUILD_CONFIG_CREATE_FAILURE });
    expect(res.isCreating).toBe(false);
    expect(_.omit(state, ['isCreating'])).toEqual(_.omit(res, ['isCreating']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });

  it('test Build Configs Request', () => {
    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, { type: BUILD_CONFIGS_REQUEST });
    expect(res.isFetching).toBe(true);
    expect(_.omit(state, ['isFetching'])).toEqual(_.omit(res, ['isFetching']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });
  it('test Build Configs Success', () => {
    const action = { type: BUILD_CONFIGS_SUCCESS, result: { items: ['MYITEM1', 'MYITEM2'] } };

    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, action);
    expect(res.isFetching).toBe(false);
    expect(res.fetched).toBe(true);
    expect(_.omit(state, ['fetched', 'isFetching', 'items'])).toEqual(_.omit(res, ['fetched', 'isFetching', 'items']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });
  it('test Build Configs Failure', () => {
    const action = { type: BUILD_CONFIGS_FAILURE };

    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, action);
    expect(res.isFetching).toBe(false);
    expect(res.fetched).toBe(false);
    expect(_.omit(state, ['fetched', 'isFetching'])).toEqual(_.omit(res, ['fetched', 'isFetching']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });

  it('test Build Config Delete Request', () => {
    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, { type: BUILD_CONFIG_DELETE_REQUEST });
    expect(res.isDeleting).toBe(true);
    expect(_.omit(state, ['isDeleting'])).toEqual(_.omit(res, ['isDeleting']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });
  it('test Build Config Delete Success', () => {
    const action = { type: BUILD_CONFIG_DELETE_SUCCESS, result: { metadata: { name: ITEM2 } } };

    const state = _.cloneDeep(resourceReducerInitialState);
    state.items = [TESTITEM1, TESTITEM2, TESTITEM3];

    const res = buildConfigsResourceReducer(state, action);
    expect(res.isDeleting).toBe(false);
    expect(res.items).toEqual([TESTITEM1, TESTITEM3]);
    expect(_.omit(state, ['isDeleting', 'items'])).toEqual(_.omit(res, ['isDeleting', 'items']));
    expect(_.omit(resourceReducerInitialState, 'items')).toEqual(_.omit(state, ['items'])); // Original state must be unchanged
  });
  it('test Build Config Delete Failure', () => {
    const state = _.cloneDeep(resourceReducerInitialState);
    const res = buildConfigsResourceReducer(state, { type: BUILD_CONFIG_DELETE_FAILURE });
    expect(res.isDeleting).toBe(false);
    expect(_.omit(state, ['isDeleting'])).toEqual(_.omit(res, ['isDeleting']));
    expect(resourceReducerInitialState).toEqual(state); // Original state must be unchanged
  });

  it('test Build Config Update Success', () => {
    const action = { type: BUILD_CONFIG_UPDATE_SUCCESS, result: TESTITEM1_UPDATE };

    const state = _.cloneDeep(resourceReducerInitialState);
    state.items = [TESTITEM1, TESTITEM2, TESTITEM3];

    const res = buildConfigsResourceReducer(state, action);
    expect(res.isUpdating).toBe(false);
    expect(res.updateError).toBe(false);
    expect(res.items).toEqual([TESTITEM1_UPDATE, TESTITEM2, TESTITEM3]);
    expect(_.omit(state, ['isUpdating', 'items', 'updateError'])).toEqual(
      _.omit(res, ['isUpdating', 'items', 'updateError'])
    );
    expect(_.omit(resourceReducerInitialState, 'items')).toEqual(_.omit(state, ['items'])); // Original state must be unchanged
  });
});
