import Status from '../k8s/status';

export default class AppStatus extends Status {
  constructor(json = {}) {
    super(json);
  }

  getVersion() {
    return this.get('version');
  }

  getClientID() {
    return this.get('clientId');
  }

  getClusterName() {
    return this.get('clusterName');
  }

  getNamespace() {
    return this.get('namespace');
  }

  getServices() {
    // TODO: return a list of object instead of the JSON
    return this.get('services');
  }
}
