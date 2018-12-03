import { find } from 'lodash-es';
import Resource from '../k8s/resource';

export class MobileService {
  constructor(json = {}) {
    this.data = json;
    this.configuration = this.data.configuration || [];
    this.configurationExt = this.data.configurationExt || [];
    this.setupText = '';
    this.serviceInstance = new Resource(this.data.serviceInstance);
    this.serviceBindings = [];
    if (this.data.serviceBindings) {
      for (const binding of this.data.serviceBindings) {
        this.serviceBindings.push(new Resource(binding));
      }
    }
    this.serviceClass = new Resource(this.data.serviceClass);
    this.servicePlan = new Resource(this.data.servicePlan);
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

  getBindingName(index = 0) {
    if (this.serviceBindings[index]) {
      return this.serviceBindings[index].metadata.get('name');
    }
    return undefined;
  }

  getServiceInstanceName() {
    return this.serviceInstance.metadata.get('name');
  }

  getSetupText() {
    return this.setupText;
  }

  getBindingSchema() {
    return this.servicePlan.spec.get('serviceBindingCreateParameterSchema');
  }

  isBindingOperationInProgress() {
    for (const binding of this.serviceBindings) {
      const conditions = binding.status.get('conditions');
      // the bind operation could be in-flight. In this case, the operation is neither ready, or failed.
      if (
        conditions &&
        find(conditions, { type: 'Ready', status: 'False' }) &&
        !this.isBindingOperationFailed(binding)
      ) {
        return true;
      }
    }
    return false;
  }

  getBindingOperation(index = 0) {
    const binding = this.serviceBindings[index];
    if (binding) {
      return binding.status.get('currentOperation');
    }
    return undefined;
  }

  isBindingOperationFailed(binding) {
    if (binding) {
      const conditions = binding.status.get('conditions');
      if (conditions && find(conditions, { type: 'Failed', status: 'True' })) {
        return true;
      }
    }
    return false;
  }

  getFormDefinition() {
    const form = this.servicePlan.spec.get('externalMetadata.schemas.service_binding.create.openshift_form_definition');
    form.filterDisplayGroupBy = JSON.parse(
      this.servicePlan.spec.get('externalMetadata.mobileclient_bind_parameters_data[0]') || ''
    ).filterDisplayGroupBy;
    return form;
  }

  setBindingSchemaDefaultValues(name, value) {
    const bindingSchema = this.getBindingSchema();
    if (bindingSchema && bindingSchema.properties && bindingSchema.properties[name]) {
      bindingSchema.properties[name].default = value;
    }
  }

  getServiceClassExternalName() {
    return this.serviceClass.spec.get('externalMetadata.serviceName');
  }

  isUPSService() {
    return this.getServiceClassExternalName() === 'ups';
  }

  toJSON() {
    return {
      ...this.data,
      configuration: this.configuration,
      configurationExt: this.configurationExt,
      serviceInstance: this.serviceInstance.toJSON(),
      serviceBindings: this.serviceBindings.toJSON(),
      serviceClass: this.serviceClass.toJSON()
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

  getConfigurationExt() {
    return this.data.configurationExt;
  }

  getConfigurationExtAsJSON() {
    // configExt field example value:
    // it is an array of annotations that start with org.aerogear.binding-ext
    // and our annotation's value is also an array
    /*
      [
        [
          {
            "type": "android",
            "typeLabel": "Android",
            "url": "https://ups-mdc.127.0.0.1.nip.io/#/app/8936dead-7552-4b55-905c-926752c759af/variants/d6f4836a-11df-42d1-a442-e9cc823715a4",
            "id": "d6f4836a-11df-42d1-a442-e9cc823715a4"
          }
        ]
      ]
      */
    if (!this.data.configurationExt || !this.data.configurationExt.length) {
      return undefined;
    }

    const configExtItems = [];

    for (const configItemStr of this.data.configurationExt) {
      let configExtItem;
      try {
        configExtItem = JSON.parse(configItemStr);
        configExtItems.push(configExtItem);
      } catch (err) {
        // not much we can do if the annotation is malformed
        console.warn('ConfigurationExt item is malformed', configItemStr);
      }
    }

    return configExtItems;
  }

  getDocumentationUrl() {
    return this.serviceClass.spec.get('externalMetadata.documentationUrl');
  }

  /**
   * This method returns a new instance of BoundMobileService, with a status of 'Binding in progress'
   * @returns {BoundMobileService}
   */
  markBindInProgress() {
    return new BoundMobileService({
      ...this.data,
      serviceBindings: [{ status: { currentOperation: 'Binding', conditions: [{ type: 'Ready', status: 'False' }] } }]
    });
  }

  /**
   * This method returns an instance of 'UnboundMobileService' with a state of 'Unbinding in progress'
   * @returns {UnboundMobileService}
   */
  unbind() {
    return new UnboundMobileService({
      ...this.data,
      isBound: false,
      serviceBinding: { status: { currentOperation: 'Unbinding', conditions: [{ type: 'Ready', status: 'False' }] } }
    });
  }
}

export class UnboundMobileService extends MobileService {
  constructor(json = {}) {
    super(json);
  }

  /**
   * This method returns a new instance of UnboundMobileService, with a status of 'Binding in progress'
   * @returns {UnboundMobileService}
   */
  bind() {
    return new UnboundMobileService({
      ...this.data,
      isBound: false,
      serviceBinding: { status: { currentOperation: 'Binding', conditions: [{ type: 'Ready', status: 'False' }] } }
    });
  }

  toJSON() {
    return {
      ...super.toJSON(),
      servicePlan: this.servicePlan.toJSON()
    };
  }
}
