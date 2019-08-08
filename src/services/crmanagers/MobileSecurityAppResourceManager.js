import { GenericResourceManager } from './GenericResourceManager';

export class MobileSecurityAppResourceManager extends GenericResourceManager {
  async create(user, res, obj, owner) {
    const apps = await super.list(user, res);

    const app = apps.items.find(item => item.spec.appId === obj.spec.appId);

    if (app) {
      return Promise.reject(new Error('An app with this identifier already exists'));
    }

    return super.create(user, res, obj, owner);
  }
}
