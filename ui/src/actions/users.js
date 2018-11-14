import DataService from '../DataService';
import fetchAction from './fetch';

export const USER_INFO_REQUEST = 'USER_INFO_REQUEST';
export const USER_INFO_SUCCESS = 'USER_INFO_SUCCESS';
export const USER_INFO_FAILURE = 'USER_INFO_FAILURE';

export const fetchUserInfo = fetchAction(
  [USER_INFO_REQUEST, USER_INFO_SUCCESS, USER_INFO_FAILURE],
  DataService.fetchUser
);
