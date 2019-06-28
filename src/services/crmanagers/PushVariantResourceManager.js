import { GenericResourceManager } from './GenericResourceManager';

export class PushVariantResourceManager extends GenericResourceManager {
  create(res, obj, owner) {
    // TODO: Add code to check if an application already exists and to create it if it doesn't.
    return super.create(res, obj, owner);
  }
}
