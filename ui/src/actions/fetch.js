import { errorCreator } from './errors';
import { list, watch, OpenShiftWatchEvents } from '../services/openshift';

const requestAction = type => ({
  type
});

const successAction = (type, result) => ({
  type,
  result
});

const failureAction = (type, error) => ({
  type,
  error
});

const watchStatus = {};

const fetchIfRequired = (resource, storekey, actionTypes, dispatch, getState) => {
  const currentState = getState();
  const currentStoreData = currentState[storekey];
  if (currentStoreData && currentStoreData.items && currentStoreData.items.length > 0 && watchStatus[resource.kind]) {
    return Promise.resolve();
  }
  dispatch(requestAction(actionTypes.REQUEST));
  return list(resource).then(data => {
    dispatch(successAction(actionTypes.SUCCESS, data));
  });
};

const watchIfRequired = (resource, actionTypes, dispatch) => {
  if (watchStatus[resource.kind]) {
    return Promise.resolve();
  }
  return watchResource(resource, actionTypes, dispatch);
};

const watchResource = (resource, actionTypes, dispatch) => {
  watchStatus[resource.kind] = true;
  // TODO: add label selectors to the watch url
  return watch(resource).then(handler => {
    handler.onEvent(event => {
      if (event.type === OpenShiftWatchEvents.CLOSED) {
        watchStatus[resource.kind] = false;
      } else if (event.type === OpenShiftWatchEvents.ADDED) {
        dispatch(successAction(actionTypes.ADDED, event.payload));
      } else if (event.type === OpenShiftWatchEvents.MODIFIED) {
        dispatch(successAction(actionTypes.MODIFIED, event.payload));
      } else if (event.type === OpenShiftWatchEvents.DELETED) {
        dispatch(successAction(actionTypes.DELETED, event.payload));
      }
    });
    handler.catch(error => {
      watchStatus[resource.kind] = false;
      dispatch(failureAction(actionTypes.FAILURE, error));
      dispatch(errorCreator(error));
    });
    return handler;
  });
};

export const fetchAndWatchOpenShiftResource = (resource, storeKey, actionTypes) => () => async (dispatch, getState) =>
  fetchIfRequired(resource, storeKey, actionTypes, dispatch, getState)
    .then(() => {
      watchIfRequired(resource, actionTypes, dispatch);
    })
    .catch(error => {
      dispatch(failureAction(actionTypes.FAILURE, error));
      dispatch(errorCreator(error));
    });

export const fetchAction = ([request, success, failure], doFetch) => () => async dispatch => {
  dispatch(requestAction(request));
  try {
    const result = await doFetch();
    dispatch(successAction(success, result));
  } catch (error) {
    dispatch(failureAction(failure, error));
    dispatch(errorCreator(error));
  }
};
