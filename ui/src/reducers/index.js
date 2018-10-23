import { combineReducers } from 'redux';
import apps from './apps';
import services from './services';
import buildConfigs from './buildConfigs';
import builds from './builds';
import user from './user';
import config from './config';

export default combineReducers({
  apps,
  services,
  buildConfigs,
  builds,
  user,
  config
});
