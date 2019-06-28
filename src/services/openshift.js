import { OpenshiftResourceManagerFactory, OpenShiftWatchEvents } from './crmanagers';

const getNamespace = () => {
  if (window && window.OPENSHIFT_CONFIG && window.OPENSHIFT_CONFIG.mdcNamespace) {
    return window.OPENSHIFT_CONFIG.mdcNamespace;
  }
  return undefined;
};

const getMasterUri = () => {
  if (window && window.OPENSHIFT_CONFIG && window.OPENSHIFT_CONFIG.masterUri) {
    return window.OPENSHIFT_CONFIG.masterUri;
  }
  return undefined;
};

const getUser = () => {
  if (window.OPENSHIFT_CONFIG && window.OPENSHIFT_CONFIG.user) {
    return Promise.resolve(Object.freeze(window.OPENSHIFT_CONFIG.user));
  }
  return Promise.reject(new Error('no user found'));
};

const get = (res, name) => OpenshiftResourceManagerFactory.forResource(res.kind).get(res, name);

const update = (res, obj) => OpenshiftResourceManagerFactory.forResource(obj.kind || res.kind).update(res, obj);

const list = res => OpenshiftResourceManagerFactory.forResource(res.kind).list(res);

const create = (res, obj, owner) =>
  OpenshiftResourceManagerFactory.forResource(obj.kind || res.kind).create(res, obj, owner);

const remove = (res, obj) => OpenshiftResourceManagerFactory.forResource(obj.kind || res.kind).remove(res, obj);

const watch = res => OpenshiftResourceManagerFactory.forResource(res.kind).watch(res);

const listWithLabels = (res, labels) => OpenshiftResourceManagerFactory.forResource(res.kind).list(res, labels);

export {
  get,
  create,
  list,
  watch,
  update,
  remove,
  OpenShiftWatchEvents,
  getUser,
  listWithLabels,
  getNamespace,
  getMasterUri
};
