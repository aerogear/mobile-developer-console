import { find } from 'lodash-es';
import Resource from '../k8s/resource';
import Status from '../k8s/status';

export default class ServiceBinding extends Resource {
  constructor(data = {}) {
    super(data);
  }

  isReady() {
    const conditions = this.status.get('conditions');
    if (conditions && find(conditions, { type: 'Ready', status: 'True' })) {
      return true;
    }
    return false;
  }

  isInProgress() {
    const conditions = this.status.get('conditions');
    // the bind operation could be in-flight. In this case, the operation is neither ready, or failed.
    if (conditions && find(conditions, { type: 'Ready', status: 'False' }) && !this.isFailed()) {
      return true;
    }
    return false;
  }

  isFailed() {
    const conditions = this.status.get('conditions');
    if (conditions && find(conditions, { type: 'Failed', status: 'True' })) {
      return true;
    }
    return false;
  }

  markInProgress() {
    const newStatus = {
      ...this.status.toJSON(),
      currentOperation: 'Binding',
      conditions: [{ type: 'Ready', status: 'False' }]
    };
    this.status = new Status(newStatus);
  }

  unbind() {
    const newStatus = {
      ...this.status.toJSON(),
      currentOperation: 'Unbinding',
      conditions: [{ type: 'Ready', status: 'False' }]
    };
    this.status = new Status(newStatus);
  }

  bind() {
    const newStatus = {
      ...this.status.toJSON(),
      currentOperation: 'Binding',
      conditions: [{ type: 'Ready', status: 'False' }]
    };
    this.status = new Status(newStatus);
  }

  currentOperation() {
    return this.status.get('currentOperation');
  }


}
