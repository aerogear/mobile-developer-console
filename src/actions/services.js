import { forEach, isArray, compact } from 'lodash-es';
import { mobileServices } from '../services/mobileservices';
import { list, watch, create, OpenShiftWatchEvents, remove, getNamespace } from '../services/openshift';
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

const watchStatus = {};

// the services are unlikely to change because they should be pre-provisioned, so we can just use the data from the store if it's available already.
async function getServiceItemsFromStoreOrRemote(dispatch, getState) {
  const currentItems = getState().services;
  if (currentItems && currentItems.items && currentItems.items.length > 0) {
    return currentItems;
  }
  dispatch({ type: SERVICES_REQUEST });
  const serviceItems = await mobileServices.list();
  dispatch({ type: SERVICES_SUCCESS, result: serviceItems });
  return serviceItems;
}

function listCustomResourceForServiceIfRequired(dispatch, service) {
  const custRes = service.bindCustomResource;
  // If there is already a list of custom resources available and we are still watching them, then the store is up to date and there is no need to list again
  if (service.customResources && watchStatus[custRes.kind]) {
    return Promise.resolve();
  }
  return listCustomResourceForService(dispatch, service);
}

function listAndWatchResourceIfRequired(dispatch, service) {
  return listCustomResourceForServiceIfRequired(dispatch, service).then(() =>
    watchCustomResourceIfRequired(dispatch, service)
  );
}

export const fetchAndWatchServices = () => async (dispatch, getState) => {
  try {
    const serviceItems = await getServiceItemsFromStoreOrRemote(dispatch, getState);
    const promises = compact(
      serviceItems.items.map(service => {
        if (service.bindCustomResource) {
          return listAndWatchResourceIfRequired(dispatch, service);
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

export const createCustomResourceForService = (service, formdata, app) => async dispatch => {
  const resDef = service.customResourceDef();
  const reqBody = service.newCustomResource(formdata);
  // we don't need to handle success event here as it will be handled by the WS handler
  return create(resDef, reqBody, app).catch(err => {
    dispatch(errorCreator(err));
    throw err;
  });
};

export const deleteCustomResource = (service, cr) => async dispatch => {
  const resDef = service.customResourceDef();
  return remove(resDef, cr).catch(err => {
    dispatch(errorCreator(err));
  });
};

function listCustomResourceForService(dispatch, service) {
  const custRes = service.bindCustomResource;
  custRes.namespace = service.bindCustomResource.namespace || getNamespace();
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

function watchCustomResourceIfRequired(dispatch, service) {
  const custRes = service.bindCustomResource;
  if (watchStatus[custRes.kind]) {
    return Promise.resolve();
  }
  return watchCustomResource(dispatch, service);
}

function watchCustomResource(dispatch, service) {
  const custRes = service.bindCustomResource;
  custRes.namespace = service.bindCustomResource.namespace || getNamespace();
  watchStatus[custRes.kind] = true;
  // TODO: add label selectors to the watch url
  return watch(custRes).then(handler => {
    forEach(isArray(handler) ? handler : [handler], h => {
      h.onEvent(event => {
        if (event.type === OpenShiftWatchEvents.CLOSED) {
          watchStatus[custRes.kind] = false;
        } else if (event.type === OpenShiftWatchEvents.ADDED) {
          dispatch({ type: CUSTOM_RESOURCE_ADDED_SUCCESS, service, resource: custRes, result: event.payload });
        } else if (event.type === OpenShiftWatchEvents.MODIFIED) {
          dispatch({ type: CUSTOM_RESOURCE_MODIFIED_SUCCESS, service, resource: custRes, result: event.payload });
        } else if (event.type === OpenShiftWatchEvents.DELETED) {
          dispatch({ type: CUSTOM_RESOURCE_DELETED_SUCCESS, service, resource: custRes, result: event.payload });
        }
      });
      h.catch(error => {
        watchStatus[custRes.kind] = false;
        dispatch({ type: CUSTOM_RESOURCE_WS_ERROR, service, resource: custRes, error });
        dispatch(errorCreator(error));
      });
    });

    return handler;
  });
}
