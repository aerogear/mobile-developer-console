import DataService from '../DataService';
import fetchAction from './fetch';

export const USER_INFO_REQUEST = 'USER_INFO_REQUEST';
export const USER_INFO_SUCCESS = 'USER_INFO_SUCCESS';
export const USER_INFO_FAILURE = 'USER_INFO_FAILURE';

export const fetchUserInfo = fetchAction(
  [USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAILURE],
  DataService.fetchUser
);

export const USER_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const USER_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const USER_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE';

export const logout = fetchAction(
  [USER_LOGOUT_REQUEST, USER_LOGOUT_SUCCESS, USER_LOGOUT_FAILURE],
  DataService.logout
);