import { GenericResourceManager } from './GenericResourceManager';
import { PushVariantResourceManager } from './PushVariantResourceManager';
import { getUser } from '../openshift';

class UserBoundResourceManager {
  constructor(resourceManager) {
    this._resourceManager = resourceManager;
  }

  create = (res, obj, owner) => getUser().then(user => this._resourceManager.create(user, res, obj, owner));
  remove = (res, obj) => getUser().then(user => this._resourceManager.remove(user, res, obj));
  update = (res, obj) => getUser().then(user => this._resourceManager.update(user, res, obj));
  list = (res, labels) => getUser().then(user => this._resourceManager.list(user, res, labels));
  watch = res => getUser().then(user => this._resourceManager.watch(user, res));
  get = (res, name) => getUser().then(user => this._resourceManager.get(user, res, name));
}

export class OpenshiftResourceManagerFactory {
  static forResource(kind) {
    switch (kind) {
      case 'pushapplications':
      case 'AndroidVariant':
      case 'IOSVariant':
        return new UserBoundResourceManager(new PushVariantResourceManager());
      default:
        return new UserBoundResourceManager(new GenericResourceManager());
    }
  }
}
