import DataService from '../DataService';
import fetchAction from './fetch';


export const SERVICE_BINDING_CREATE_REQUEST = 'SERVICE_BINDING_CREATE_REQUEST';
export const SERVICE_BINDING_CREATE_SUCCESS = 'SERVICE_BINDING_CREATE_SUCCESS';
export const SERVICE_BINDING_CREATE_FAILURE = 'SERVICE_BINDING_CREATE_FAILURE';

export const createBinding = (
  mobileClientName,
  serviceInstanceName,
  credentialSecretName,
  parametersSecretName,
  serviceClassExternalName,
  formData
) =>
  fetchAction(
    [SERVICE_BINDING_CREATE_REQUEST, SERVICE_BINDING_CREATE_SUCCESS, SERVICE_BINDING_CREATE_FAILURE],
    async () =>
      DataService.createBinding(
        mobileClientName,
        serviceInstanceName,
        credentialSecretName,
        parametersSecretName,
        serviceClassExternalName,
        formData
      ).then(binding => ({ binding, serviceInstanceName }))
  )();

export const SERVICE_BINDING_DELETE_REQUEST = 'SERVICE_BINDING_DELETE_REQUEST';
export const SERVICE_BINDING_DELETE_SUCCESS = 'SERVICE_BINDING_DELETE_SUCCESS';
export const SERVICE_BINDING_DELETE_FAILURE = 'SERVICE_BINDING_DELETE_FAILURE';

export const deleteBinding = name =>
  fetchAction(
    [SERVICE_BINDING_DELETE_REQUEST, SERVICE_BINDING_DELETE_SUCCESS, SERVICE_BINDING_DELETE_FAILURE],
    async () => DataService.deleteBinding(name).then(resp => ({ resp, name }))
  )();
