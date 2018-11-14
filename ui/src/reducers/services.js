import { SERVICES_REQUEST, SERVICES_SUCCESS, SERVICES_FAILURE } from '../actions/services';
import resourceReducer from './resource';

const services = resourceReducer({
  listRequest: SERVICES_REQUEST,
  listSuccess: SERVICES_SUCCESS,
  listFailure: SERVICES_FAILURE
});

export default services;
