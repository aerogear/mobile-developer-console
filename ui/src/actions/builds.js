import DataService from '../DataService';
import fetchAction from './fetch';

export const BUILDS_REQUEST = 'BUILDS_REQUEST';
export const BUILDS_SUCCESS = 'BUILDS_SUCCESS';
export const BUILDS_FAILURE = 'BUILDS_FAILURE';

export const fetchBuilds = fetchAction([BUILDS_REQUEST, BUILDS_SUCCESS, BUILDS_FAILURE], DataService.builds);
