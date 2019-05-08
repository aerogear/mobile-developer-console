import { isArray, isObject, map } from 'lodash-es';
import { fetchAction, fetchAndWatchOpenShiftResource } from './fetch';
import { buildConfigsService } from '../services/buildconfigs';

export const BUILDS_REQUEST = 'BUILDS_REQUEST';
export const BUILDS_SUCCESS = 'BUILDS_SUCCESS';
export const BUILDS_FAILURE = 'BUILDS_FAILURE';

export const BUILD_TRIGGER_REQUEST = 'BUILD_TRIGGER_REQUEST';
export const BUILD_TRIGGER_SUCCESS = 'BUILD_TRIGGER_SUCCESS';
export const BUILD_TRIGGER_FAILURE = 'BUILD_TRIGGER_FAILURE';

export const BUILDS_MODIFIED_SUCCESS = 'BUILDS_MODIFIED_SUCCESS';
export const BUILDS_DELETE_SUCCESS = 'BUILDS_DELETE_SUCCESS';

export const fetchAndWatchBuilds = fetchAndWatchOpenShiftResource(
  buildConfigsService.buildRes,
  'builds',
  {
    REQUEST: BUILDS_REQUEST,
    SUCCESS: BUILDS_SUCCESS,
    FAILURE: BUILDS_FAILURE,
    ADDED: BUILD_TRIGGER_SUCCESS,
    MODIFIED: BUILDS_MODIFIED_SUCCESS,
    DELETED: BUILDS_DELETE_SUCCESS
  },
  {
    success: (type, data) => {
      if (data.items && isArray(data.items)) {
        const items = map(data.items, item => buildConfigsService.addBuildUrl(item));
        data.items = items;
        return { type, result: data };
      } else if (isObject(data)) {
        const result = buildConfigsService.addBuildUrl(data);
        return { type, result };
      }
      return { type, result: data };
    }
  }
);

export const triggerBuild = name =>
  fetchAction([BUILD_TRIGGER_REQUEST, BUILD_TRIGGER_SUCCESS, BUILD_TRIGGER_FAILURE], async () =>
    buildConfigsService.trigger(name)
  )();

export const BUILD_DOWNLOAD_REQUEST = 'BUILD_DOWNLOAD_REQUEST';
export const BUILD_DOWNLOAD_SUCCESS = 'BUILD_DOWNLOAD_SUCCESS';
export const BUILD_DOWNLOAD_FAILURE = 'BUILD_DOWNLOAD_FAILURE';

export const generateDownloadURL = name =>
  fetchAction([BUILD_DOWNLOAD_REQUEST, BUILD_DOWNLOAD_SUCCESS, BUILD_DOWNLOAD_FAILURE], async () =>
    buildConfigsService.generateDownloadURL(name)
  )();
