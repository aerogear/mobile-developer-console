import { compact } from 'lodash-es';
import { mobileServices } from '../services/mobileservices';
import { list, watch, create, OpenShiftWatchEvents } from '../services/openshift';
import { errorCreator } from './errors';

export const SERVICES_REQUEST = 'SERVICES_REQUEST';
export const SERVICES_SUCCESS = 'SERVICES_SUCCESS';
export const SERVICES_FAILURE = 'SERVICES_FAILURE';

export const CUSTOM_RESOURCE_LIST_SUCCESS = 'CUSTOM_RESOURCE_LIST_SUCCESS';
export const CUSTOM_RESOURCE_LIST_ERROR = 'CUSTOM_RESOURCE_LIST_ERROR';
export const CUSTOM_RESOURCE_WS_ERROR = 'CUSTOM_RESOURCE_WS_ERROR';
export const CUSTOM_RESOURCE_ADDED_SUCCESS = 'CUSTOM_RESOURCE_ADDED_SUCCESS';
export const CUSTOM_RESOURCE_MODIFIED_SUCCESS = 'CUSTOM_RESOURCE_MODIFIED_SUCCESS';
export const CUSTOM_RESOURCE_DELETED_SUCCESS = 'CUSTOM_RESOURCE_DELETED_SUCCESS';

export const fetchServices = () => async dispatch => {
  dispatch({ type: SERVICES_REQUEST });
  try {
    const serviceItems = await mobileServices.list();
    dispatch({ type: SERVICES_SUCCESS, result: serviceItems });
    const promises = compact(
      serviceItems.items.map(service => {
        if (service.bindCustomResource) {
          return listCustomResourceForService(dispatch, service).then(() => watchCustomResource(dispatch, service));
        }
        return undefined;
      })
    );
    await Promise.all(promises);
  } catch (error) {
    dispatch({ type: SERVICES_FAILURE, error });
    dispatch(errorCreator(error));
  }
};

export const createCustomResourceForService = (service, formdata) => async dispatch => {
  const resDef = service.customResourceDef();
  const reqBody = service.newCustomResource(formdata);
  // we don't need to handle success event here as it will be handled by the WS handler
  return create(resDef, reqBody).catch(err => {
    dispatch(errorCreator(err));
  });
};

function listCustomResourceForService(dispatch, service) {
  const custRes = service.bindCustomResource;
  custRes.namespace = window.OPENSHIFT_CONFIG.mdcNamespace;
  return list(custRes)
    .then(resList => {
      const { items } = resList;
      dispatch({ type: CUSTOM_RESOURCE_LIST_SUCCESS, service, resource: custRes, items });
      return items;
    })
    .catch(error => {
      dispatch({ type: CUSTOM_RESOURCE_LIST_ERROR, service, resource: custRes, error });
      dispatch(errorCreator(error));
      return [];
    });
}

function watchCustomResource(dispatch, service) {
  const custRes = service.bindCustomResource;
  custRes.namespace = window.OPENSHIFT_CONFIG.mdcNamespace;
  // TODO: add label selectors to the watch url
  return watch(custRes).then(handler => {
    handler.onEvent(event => {
      if (event.type === OpenShiftWatchEvents.ADDED) {
        dispatch({ type: CUSTOM_RESOURCE_ADDED_SUCCESS, service, resource: custRes, result: event.payload });
      }
      if (event.type === OpenShiftWatchEvents.MODIFIED) {
        dispatch({ type: CUSTOM_RESOURCE_MODIFIED_SUCCESS, service, resource: custRes, result: event.payload });
      }
      if (event.type === OpenShiftWatchEvents.DELETED) {
        dispatch({ type: CUSTOM_RESOURCE_DELETED_SUCCESS, service, resource: custRes, result: event.payload });
      }
    });
    handler.catch(error => {
      dispatch({ type: CUSTOM_RESOURCE_WS_ERROR, service, resource: custRes, error });
      dispatch(errorCreator(error));
    });
    return handler;
  });
}
