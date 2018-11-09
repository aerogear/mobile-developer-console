export class Status {
  constructor(jsonApp) {
    if (jsonApp.status) {
      this.status = jsonApp.status;
    } else {
      this.status = {};
      jsonApp.status = this.status;
    }
  }

  getVersion() {
    return this.status.version;
  }

  getClientID() {
    return this.status.clientId;
  }

  getClusterName() {
    return this.status.clusterName;
  }

  getNamespace() {
    return this.status.namespace;
  }

  getServices() {
    // TODO: return a list of object instead of the JSON
    return this.status.services;
  }
}
