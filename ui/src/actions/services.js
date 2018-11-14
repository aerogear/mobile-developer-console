import DataService from '../DataService';
import fetchAction from './fetch';

export const SERVICES_REQUEST = 'SERVICES_REQUEST';
export const SERVICES_SUCCESS = 'SERVICES_SUCCESS';
export const SERVICES_FAILURE = 'SERVICES_FAILURE';

export const fetchServices = fetchAction(
  [SERVICES_REQUEST, SERVICES_SUCCESS, SERVICES_FAILURE],
  DataService.serviceInstances
);
