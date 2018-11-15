import { find } from 'lodash-es';
import Resource from '../k8s/resource';

export class MobileService {
  constructor(json = {}) {
    this.data = json;
    this.configuration = this.data.configuration || {};
    this.setupText = '';
    this.serviceInstance = new Resource(this.data.serviceInstance);
    this.serviceBinding = new Resource(this.data.serviceBinding);
    this.serviceClass = new Resource(this.data.serviceClass);
  }

  getName() {
    return this.data.name;
  }

  getId() {
    return this.data.name;
  }

  getDescription() {
    return this.serviceClass.spec.get('description');
  }

  getLogoUrl() {
    return this.data.imageUrl;
  }

  getIconClass() {
    return this.data.iconClass;
  }

  isBound() {
    return this.data.isBound;
  }

  getBindingName() {
    return this.serviceBinding.metadata.get('name');
  }

  getServiceInstanceName() {
    return this.serviceInstance.metadata.get('name');
  }

  getSetupText() {
    return this.setupText;
  }

  toJSON() {
    return {
      ...this.data
    };
  }
}

export class BoundMobileService extends MobileService {
  constructor(json = {}) {
    super(json);
  }

  getConfiguration() {
    return this.data.configuration;
  }

  getDocumentationUrl() {
    return this.serviceClass.spec.get('externalMetadata.documentationUrl');
  }
}

export class UnboundMobileService extends MobileService {
  constructor(json = {}) {
    super(json);
    this.servicePlan = new Resource(this.data.servicePlan);
  }

  getBindingSchema() {
    return this.servicePlan.spec.get('serviceBindingCreateParameterSchema');
  }

  setBindingSchemaDefaultValues(name, value) {
    const bindingSchema = this.getBindingSchema();
    if (bindingSchema && bindingSchema.properties[name]) {
      bindingSchema.properties[name].default = value;
    }
  }

  getFormDefinition() {
    return this.servicePlan.spec.get('externalMetadata.schemas.service_binding.create.openshift_form_definition');
  }

  getServiceClassExternalName() {
    return this.serviceClass.spec.get('externalMetadata.serviceName');
  }

  isBindingOperationInProgress() {
    const conditions = this.serviceBinding.status.get('conditions');
    // the bind operation could be in-flight. In this case, the operation is neither ready, or failed.
    if (conditions && find(conditions, { type: 'Ready', status: 'False' }) && !this.isBindingOperationFailed()) {
      return true;
    }
    return false;
  }

  getBindingOperation() {
    return this.serviceBinding.status.get('currentOperation');
  }

  isBindingOperationFailed() {
    const conditions = this.serviceBinding.status.get('conditions');
    if (conditions && find(conditions, { type: 'Failed', status: 'True' })) {
      return true;
    }
    return false;
  }
}
