import Spec from '../k8s/basespec';

export default class AppSpec extends Spec {
  constructor(json = {}) {
    super(json);
  }

  getApiKey() {
    console.log('did it make it to appspec1');
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

  setName(newName) {
    this.set('name', newName);
  }

  setType(newType) {
    this.set('clientType', newType);
  }
}
