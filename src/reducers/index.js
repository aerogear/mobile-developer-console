import { combineReducers } from 'redux';
import { apps } from './apps';
import services from './services';
import buildConfigs, { buildConfigReducer } from './buildConfigs';
import builds from './builds';
import user from './user';
import config from './config';
import createClientAppDialog from './createClientAppDialog';
import errors from './errors';

export default combineReducers({
  apps,
  services,
  buildConfigs,
  createBuildConfig: buildConfigReducer,
  builds,
  user,
  config,
  createClientAppDialog,
  errors
});
