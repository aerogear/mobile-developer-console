import { Spec } from './mobileappspec';
import { Metadata } from './metadata';
import { Status } from './status';

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
    this.spec = new Spec(this.app);
    this.metadata = new Metadata(this.app);
    this.status = new Status(this.app);
  }

  getID() {
    return this.metadata.getID();
  }

  getName() {
    return this.getSpec().getName();
  }

  getType() {
    return this.getSpec().getType();
  }

  getAppIdentifier() {
    return this.getSpec().getAppIdentifier();
  }

  getStatus() {
    return this.status;
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

  /**
   * Finds an app into an array of raw json apps and returns an instance of MobileApp if found or null otherwise
   * @param ary the array of json apps data
   * @param appID the id of the app to be found
   * @returns {*}
   */
  static find(ary, appID) {
    const mobileAppJson = ary.find(app => app.metadata.name === appID);
    if (mobileAppJson) {
      return new MobileApp(mobileAppJson);
    }
    return null;
  }
}

export default MobileApp;
