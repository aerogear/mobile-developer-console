export class Spec {
  constructor(appJson) {
    if (appJson.spec) {
      this.spec = appJson.spec;
    } else {
      appJson.spec = this.spec = {}
    }
    this.set.bind(this);
  }

  getApiKey() {
    return this.spec.apiKey;
  }

  getDmzUrl() {
    return this.spec.dmzUrl;
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
