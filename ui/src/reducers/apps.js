import {
  APPS_REQUEST,
  APPS_SUCCESS,
  APPS_FAILURE,
  APP_REQUEST,
  APP_SUCCESS,
  APP_FAILURE,
  APP_CREATE_REQUEST,
  APP_CREATE_SUCCESS,
  APP_CREATE_FAILURE,
  APP_DELETE_REQUEST,
  APP_DELETE_SUCCESS,
  APP_DELETE_FAILURE,
  APP_UPDATE_REQUEST,
  APP_UPDATE_SUCCESS,
  APP_UPDATE_FAILURE
} from '../actions/apps';
import resourceReducer from './resource';

const apps = resourceReducer({
  listRequest: APPS_REQUEST,
  listSuccess: APPS_SUCCESS,
  listFailure: APPS_FAILURE,
  readRequest: APP_REQUEST,
  readSuccess: APP_SUCCESS,
  readFailure: APP_FAILURE,
  createRequest: APP_CREATE_REQUEST,
  createSuccess: APP_CREATE_SUCCESS,
  createFailure: APP_CREATE_FAILURE,
  updateRequest: APP_UPDATE_REQUEST,
  updateSuccess: APP_UPDATE_SUCCESS,
  updateFailure: APP_UPDATE_FAILURE,
  deleteRequest: APP_DELETE_REQUEST,
  deleteSuccess: APP_DELETE_SUCCESS,
  deleteFailure: APP_DELETE_FAILURE
});

export default apps;
