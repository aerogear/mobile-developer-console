import { APP_FORM_RESET, APP_FIELD_SETVALUE, APP_EDIT } from '../actions/apps';
import { MobileApp } from '../models';
import _ from 'lodash';

const defaultState = {
  fields: {},
  app: new MobileApp().toJSON()
};

/**
 * Reducers for the create client app dialog.
 * @param {string} state
 * @param {*} action
 */
const resourceReducer = (state = defaultState, action) => {
  switch (action.type) {
    case APP_FORM_RESET:
      return {
        ...state,
        fields: {}
      };
    case APP_FIELD_SETVALUE: {
      const appModel = new MobileApp(_.cloneDeep(state.app));
      appModel.setProperty(action.payload.name, action.payload.value);
      return {
        ...state,
        app: appModel.toJSON()
      };
    }
    case APP_EDIT:
      return {
        ...state,
        app: action.payload
      };
    default:
      return state;
  }
};

export default resourceReducer;
