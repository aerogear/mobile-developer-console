export class MobileApp {
  constructor(json) {
    this.app = json;
    this.spec = new MobileAppSpec(this.app);
    this.metadata = new MobileAppMetadata(this.app);
  }

  getID() {
    return this.app.metadata.name;
  }

  setAppDetails(appName, appType, appIdentifier) {
    this.spec.setName(appName);
    this.spec.setType(appType);
    this.spec.setAppIdentifier(appIdentifier);
  }

  getSpec() {
    return new MobileAppSpec(this.app);
  }

  toJSON() {
    return { ...this.app };
  }
}

export class MobileAppSpec {
  constructor(appJson) {
    this.spec = appJson.spec;
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

  setName(newName) {
    this.spec.name = newName;
  }

  setType(newType) {
    this.spec.clientType = newType;
  }

  setAppIdentifier(newAppIdentifier) {
    this.spec.appIdentifier = newAppIdentifier;
  }
}

export class MobileAppMetadata {
  constructor(appJson) {
    this.metadata = appJson.metadata;
  }

  getID() {
    return this.metadata.name;
  }

  getNamespace() {
    return this.metadata.namespace;
  }

  getSelfLink() {
    return this.metadata.selfLink;
  }

  getUID() {
    reutrn this.metadata.uid
  }
}

export default MobileApp;
