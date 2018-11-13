export class Metadata {
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
