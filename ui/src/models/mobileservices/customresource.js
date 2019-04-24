import Resource from '../k8s/resource';
import Status from '../k8s/status';

/**
 * The base class to represent the custom resources that are used by the MDC.
 * It is based on the current implementation of KeycloakRealm.
 * However, it is unlikely that all CRs will follow the same convention, so we will likely to create new classes to represent other CRs.
 * In that case, extend this class and override the methods.
 */
export class CustomResource extends Resource {
  static READY_STATUSES = ['reconcile'];
  static INPROGRESS_STATUSES = ['accepted', 'modified', 'provision', 'deprovisioning', 'deprovisioned'];
  static FAILED_STATUSES = ['failed', 'deprovisionFailed'];

  constructor(data = {}) {
    super(data);
  }

  getName() {
    return this.metadata.get('name');
  }

  isReady() {
    const phase = this.status.get('phase');
    return CustomResource.READY_STATUSES.indexOf(phase) > -1;
  }

  isInProgress() {
    const phase = this.status.get('phase');
    return CustomResource.INPROGRESS_STATUSES.indexOf(phase) > -1;
  }

  isFailed() {
    const phase = this.status.get('phase');
    return CustomResource.FAILED_STATUSES.indexOf(phase) > -1;
  }

  unbind() {
    const newStatus = {
      ...this.status.toJSON(),
      phase: 'deprovisioning'
    };
    this.status = new Status(newStatus);
  }

  bind() {
    const newStatus = {
      ...this.status.toJSON(),
      phase: 'accepted'
    };
    this.status = new Status(newStatus);
  }

  getCurrentOperation() {
    return this.status.get('phase');
  }
}
