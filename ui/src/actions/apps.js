import DataService from '../DataService';
import fetchAction from './fetch';

export const APPS_REQUEST = 'APPS_REQUEST';
export const APPS_SUCCESS = 'APPS_SUCCESS';
export const APPS_FAILURE = 'APPS_FAILURE';

export const fetchApps = fetchAction([APPS_REQUEST, APPS_SUCCESS, APPS_FAILURE], DataService.mobileClients);

export const APP_REQUEST = 'APP_REQUEST';
export const APP_SUCCESS = 'APP_SUCCESS';
export const APP_FAILURE = 'APP_FAILURE';

export const fetchApp = appName =>
  fetchAction([APP_REQUEST, APP_SUCCESS, APP_FAILURE], async () => DataService.mobileApp(appName))();

export const APP_CREATE_REQUEST = 'APP_CREATE_REQUEST';
export const APP_CREATE_SUCCESS = 'APP_CREATE_SUCCESS';
export const APP_CREATE_FAILURE = 'APP_CREATE_FAILURE';

export const createApp = app =>
  fetchAction([APP_CREATE_REQUEST, APP_CREATE_SUCCESS, APP_CREATE_FAILURE], async () =>
    DataService.createApp(app.getSpec().toJSON())
  )();

export const APP_UPDATE_REQUEST = 'APP_UPDATE_REQUEST';
export const APP_UPDATE_SUCCESS = 'APP_UPDATE_SUCCESS';
export const APP_UPDATE_FAILURE = 'APP_UPDATE_FAILURE';

export const updateApp = app =>
  fetchAction([APP_UPDATE_REQUEST, APP_UPDATE_SUCCESS, APP_UPDATE_FAILURE], async () =>
    DataService.updateApp(app.getID(), app.getSpec().toJSON())
  )();

export const APP_DELETE_REQUEST = 'APP_DELETE_REQUEST';
export const APP_DELETE_SUCCESS = 'APP_DELETE_SUCCESS';
export const APP_DELETE_FAILURE = 'APP_DELETE_FAILURE';

export const deleteApp = name =>
  fetchAction([APP_DELETE_REQUEST, APP_DELETE_SUCCESS, APP_DELETE_FAILURE], async () => DataService.deleteApp(name))();

// CREATE CLIENT APP DIALOG ACTIONS
export const APP_FORM_RESET = 'FORM_RESET';
export const APP_FIELD_SETVALUE = 'FIELD_SETVALUE';
export const APP_EDIT = 'APP_EDIT';

/**
 * Sets the value of a field into the state
 * @param {string} fieldId id of the field
 * @param {string} value the value of the field
 * @param {boolean} isValid if the field is valid or not
 */
export const setFieldValue = (fieldId, value, isValid) => ({
  type: APP_FIELD_SETVALUE,
  payload: { name: fieldId, value, valid: isValid }
});

export const editApp = mobileApp => ({
  type: APP_EDIT,
  payload: mobileApp ? mobileApp.toJSON() : null
});

/**
 * Resets the form to its initial state.
 */
export const resetForm = () => ({
  type: APP_FORM_RESET
});
