import _ from 'lodash';
import reducer from './createClientAppDialog';
import { MobileApp } from '../models';
import { APP_FORM_RESET, APP_FIELD_SETVALUE, APP_EDIT } from '../actions/apps';

const initialState = {
  fields: {},
  app: new MobileApp().toJSON()
};

const initialStateWithFields = {
  fields: {
    field1: 'value1',
    field2: 'value2'
  },
  ...initialState
};

const TEST = {
  TEST_FIELD1: 'test_field',
  TEST_VALUE1: 'test_value1',
  TEST_VALUE1_2: 'test_value1_2'
};

describe('error createClientAppDialog reducer', () => {
  it('test dismiss all', () => {
    const state = _.cloneDeep(initialStateWithFields);

    const res = reducer(state, { type: APP_FORM_RESET });
    expect(res.fields).toEqual({});
    expect(res).toEqual(initialState);
    expect(state).toEqual(initialStateWithFields); // Original state must be unchanged
  });
  it('app set field', () => {
    const state = _.cloneDeep(initialState);
    const testAppModel = new MobileApp(_.cloneDeep(state.app));
    testAppModel.setProperty(TEST.TEST_FIELD1, TEST.TEST_VALUE1);

    const res = reducer(state, {
      type: APP_FIELD_SETVALUE,
      payload: { name: TEST.TEST_FIELD1, value: TEST.TEST_VALUE1 }
    });
    expect(res.app).toBeDefined();
    const resAppModel = new MobileApp(res.app);
    expect(resAppModel.getProperty(TEST.TEST_FIELD1)).toEqual(TEST.TEST_VALUE1);
    expect(state).toEqual(initialState); // Original state must be unchanged
  });
  it('app edit', () => {
    // setup
    const initialStateWithApp = _.cloneDeep(initialState);
    const testAppModel = new MobileApp(initialStateWithApp.app);
    testAppModel.setProperty(TEST.TEST_FIELD1, TEST.TEST_VALUE1);
    initialStateWithApp.app = testAppModel.toJSON();
    const state = _.cloneDeep(initialStateWithApp);

    // tests
    const testAppModel2 = new MobileApp(_.cloneDeep(initialState.app));
    testAppModel.setProperty(TEST.TEST_FIELD1, TEST.TEST_VALUE1_2);

    const res = reducer(initialStateWithApp, { type: APP_EDIT, payload: testAppModel2.toJSON() });
    expect(res.app).toEqual(testAppModel2.toJSON());

    expect(state).toEqual(initialStateWithApp); // Original state must be unchanged
  });
});
