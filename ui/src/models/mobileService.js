export class MobileService {
  constructor(json = {}) {
    this.data = json;
    this.configuration = this.data.configuration || {};
    //TODO: we can add more models for those fields
    this.serviceInstance = this.data.serviceInstance || {};
    this.serviceBinding = this.data.serviceBinding || {};
    this.serviceClass = this.data.serviceClass || {};
  }

  getName() {
    return this.data.name;
  }

  getId() {
    return this.data.name;
  }

  getDescription() {
    return this.serviceClass.spec.description;
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
    return this.serviceBinding.metadata.name;
  }

  getServiceInstanceName() {
    return this.serviceInstance.metadata.name;
  }

  getSetupText() {

  }

  toJSON() {
    return {
      ...this.data
    }
  }
}

export class BoundMobileService extends MobileService {
  constructor(json = {}) {
    super(json)
  }

  getConfiguration() {
    return this.data.configuration;
  }

  getDocumentationUrl() {
    return this.serviceClass.spec.externalMetadata.documentationUrl;
  }
}

export class UnboundMobileService extends MobileService {
  constructor(json = {}) {
    super(json)
    this.servicePlan = this.data.servicePlan || {};
  }

  getBindingSchema() {
    return this.servicePlan.spec.serviceBindingCreateParameterSchema
  }

  setBindingSchemaDefaultValues(name, value){
    if (this.getBindingSchema().properties[name]) {
      this.getBindingSchema().properties[name].default = value;
    }
  }

  getFormDefinition() {
    return this.servicePlan.spec.externalMetadata.schemas.service_binding.create.openshift_form_definition;
  }

  getServiceClassExternalName() {
    return this.serviceClass.spec.externalMetadata.serviceName;
  }

  isBindingOperationInProgress() {
    return this.serviceBinding.status.asyncOpInProgress;
  }

  getBindingOperation() {
    return this.serviceBinding.status.currentOperation;
  }

  isBindingOperationFailed() {
    const conditions = this.serviceBinding.status.conditions;
    const asyncOpInProgress = this.serviceBinding.status.asyncOpInProgress;
    if(conditions && conditions[0] && conditions[0].status === 'False' && !asyncOpInProgress) {
      return true;
    }
    return false;
  }
}