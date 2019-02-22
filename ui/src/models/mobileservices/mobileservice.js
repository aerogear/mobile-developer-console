import { find } from 'lodash-es';
import Resource from '../k8s/resource';
import { ServiceBinding } from './servicebinding';

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
        this.serviceBindings.push(new ServiceBinding(binding));
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
    const boundBinding = find(this.serviceBindings, binding => binding.isReady());
    return boundBinding != null;
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
    const inprogressBinding = find(this.serviceBindings, binding => binding.isInProgress());
    return inprogressBinding != null;
  }

  getBindingOperation() {
    const currentBinding = find(this.serviceBindings, binding => binding.isInProgress());
    if (currentBinding) {
      return currentBinding.getCurrentOperation();
    }
    return undefined;
  }

  isBindingOperationFailed() {
    const failedBinding = find(this.serviceBindings, binding => binding.isFailed());
    return failedBinding != null;
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
      }
    }

    return configExtItems;
  }

  getDocumentationUrl() {
    return this.serviceClass.spec.get('externalMetadata.documentationUrl');
  }

  findBinding(bindingName) {
    return find(this.serviceBindings, binding => binding.getName() === bindingName);
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
