import { PLATFORM_ANDROID } from '../../components/create_client/Constants';

export class Spec {
  constructor(appJson) {
    if (appJson.spec) {
      this.spec = appJson.spec;
    } else {
      this.spec = { clientType: PLATFORM_ANDROID };
      appJson.spec = this.spec;
    }
    this.set.bind(this);
  }

  getApiKey() {
    return this.spec.apiKey;
  }

  getDmzUrl() {
    return this.spec.dmzUrl;
  }

  getType() {
    return this.spec.clientType;
  }

  getName() {
    return this.spec.name;
  }

  getAppIdentifier() {
    return this.spec.appIdentifier;
  }

  setName(newName) {
    this.spec.name = newName;
  }

  setType(newType) {
    this.spec.clientType = newType;
  }

  setAppIdentifier(newAppIdentifier) {
    this.spec.appIdentifier = newAppIdentifier;
  }

  set(key, value) {
    this.spec[key] = value;
  }

  get(key) {
    const value = this.spec[key];
    return value;
  }

  toJSON() {
    return { ...this.spec };
  }
}
