import {
  APPS_REQUEST,
  APPS_SUCCESS,
  APPS_FAILURE,
  APP_CREATE_REQUEST,
  APP_CREATE_SUCCESS,
  APP_CREATE_FAILURE
} from '../actions/apps';
import resourceReducer from './resource';

const apps = resourceReducer({
  listRequest: APPS_REQUEST,
  listSuccess: APPS_SUCCESS,
  listFailure: APPS_FAILURE,
  createRequest: APP_CREATE_REQUEST,
  createSuccess: APP_CREATE_SUCCESS,
  createFailure: APP_CREATE_FAILURE
});

export default apps;
