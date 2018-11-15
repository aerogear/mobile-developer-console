import Spec from '../k8s/basespec';

export default class AppSpec extends Spec {
  constructor(json = {}) {
    super(json);
  }

  getApiKey() {
    return this.get('apiKey');
  }

  getDmzUrl() {
    return this.get('dmzUrl');
  }

  getType() {
    return this.get('clientType');
  }

  getName() {
    return this.get('name');
  }

  getAppIdentifier() {
    return this.get('appIdentifier');
  }

  setName(newName) {
    this.set('name', newName);
  }

  setType(newType) {
    this.set('clientType', newType);
  }

  setAppIdentifier(newAppIdentifier) {
    this.set('appIdentifier', newAppIdentifier);
  }
}
