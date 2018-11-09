import { CREATE_CLIENT_APP_ID, CREATE_CLIENT_NAME } from '../components/create_client/Constants';

export const PROPERTIES = {
  NAME: 'name',
  APP_IDENTIFIER: 'appIdentifier'
};

export class MobileApp {
  constructor(json) {
    if (json) {
      // we are loading an existing app
      this.app = json;
    } else {
      // we are creating a new app
      this.app = {};
    }
    this.spec = new MobileAppSpec(this.app);
    this.metadata = new MobileAppMetadata(this.app);
  }

  getID() {
    return this.app.metadata.name;
  }

  getName() {
    return this.getSpec().getName();
  }

  getType() {
    return this.getSpec().getType();
  }

  setAppDetails(appName, appType, appIdentifier) {
    this.spec.setName(appName);
    this.spec.setType(appType);
    this.spec.setAppIdentifier(appIdentifier);
  }

  setProperty(propertyName, propertyValue) {
    switch (propertyName) {
      default:
        this.getSpec().set(propertyName, propertyValue);
        break;
    }
  }

  getProperty(propertyName) {
    switch (propertyName) {
      default:
        return this.getSpec().get(propertyName);
    }
  }

  _validateProperty(propertyName) {
    const value = this.getProperty(propertyName);
    if (value) {
      switch (propertyName) {
        case PROPERTIES.NAME:
          return value.match('^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$');
        case PROPERTIES.APP_IDENTIFIER:
          return value.match('^[a-zA-Z][\\w]*(\\.[a-zA-Z][\\w]*)+$');
        default:
          return 'success';
      }
    }

    return undefined;
  }

  isValid(propertyName) {
    if (propertyName) {
      return this._validateProperty(propertyName);
    }
    return this._validateProperty(PROPERTIES.NAME) && this._validateProperty(PROPERTIES.APP_IDENTIFIER);
  }

  getSpec() {
    return this.spec;
  }

  toJSON() {
    return { ...this.app };
  }
}

export class MobileAppSpec {
  constructor(appJson) {
    if (appJson.spec) {
      this.spec = appJson.spec;
    } else {
      this.spec = {};
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
    return this.metadata.uid;
  }
}

export default MobileApp;
