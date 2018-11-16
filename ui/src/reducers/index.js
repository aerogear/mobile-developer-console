import { combineReducers } from 'redux';
import apps from './apps';
import services from './services';
import buildConfigs, { buildConfigReducer } from './buildConfigs';
import builds from './builds';
import user from './user';
import config from './config';
import serviceBindings from './serviceBindings';
import createClientAppDialog from './createClientAppDialog';

export default combineReducers({
  apps,
  services,
  buildConfigs,
  createBuildConfig: buildConfigReducer,
  builds,
  user,
  config,
  serviceBindings,
  createClientAppDialog
});
