import { isArray, forEach } from 'lodash-es';
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

const fetchIfRequired = (resource, storekey, actionTypes, dispatch, getState, actionCreators) => {
  const requestActionCreator = actionCreators.request || requestAction;
  const successActionCreators = actionCreators.success || successAction;
  const currentState = getState();
  const currentStoreData = currentState[storekey];
  if (currentStoreData && currentStoreData.fetched && watchStatus[resource.kind]) {
    return Promise.resolve();
  }
  dispatch(requestActionCreator(actionTypes.REQUEST));
  return list(resource).then(data => {
    dispatch(successActionCreators(actionTypes.SUCCESS, data));
  });
};

const watchIfRequired = (resource, actionTypes, dispatch, actionCreators) => {
  if (watchStatus[resource.kind]) {
    return Promise.resolve();
  }
  return watchResource(resource, actionTypes, dispatch, actionCreators);
};

const watchResource = (resource, actionTypes, dispatch, actionCreators) => {
  const successActionCreators = actionCreators.success || successAction;
  const failureActionCreator = actionCreators.failure || failureAction;
  watchStatus[resource.kind] = true;
  // TODO: add label selectors to the watch url
  return watch(resource).then(handler => {
    forEach(isArray(handler) ? handler : [handler], h => {
      h.onEvent(event => {
        if (event.type === OpenShiftWatchEvents.CLOSED) {
          watchStatus[resource.kind] = false;
        } else if (event.type === OpenShiftWatchEvents.ADDED) {
          dispatch(successActionCreators(actionTypes.ADDED, event.payload));
        } else if (event.type === OpenShiftWatchEvents.MODIFIED) {
          dispatch(successActionCreators(actionTypes.MODIFIED, event.payload));
        } else if (event.type === OpenShiftWatchEvents.DELETED) {
          dispatch(successActionCreators(actionTypes.DELETED, event.payload));
        }
      });
      h.catch(error => {
        watchStatus[resource.kind] = false;
        dispatch(failureActionCreator(actionTypes.FAILURE, error));
        dispatch(errorCreator(error));
      });
    });
    return handler;
  });
};

export const fetchAndWatchOpenShiftResource = (resource, storeKey, actionTypes, actionCreators = {}) => () => async (
  dispatch,
  getState
) => {
  const failureActionCreator = actionCreators.failure || failureAction;
  fetchIfRequired(resource, storeKey, actionTypes, dispatch, getState, actionCreators)
    .then(() => {
      watchIfRequired(resource, actionTypes, dispatch, actionCreators);
    })
    .catch(error => {
      dispatch(failureActionCreator(actionTypes.FAILURE, error));
      dispatch(errorCreator(error));
    });
};

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
