import { find, filter, reduce, uniqBy } from 'lodash-es';
import { newCustomResource, newCustomResourceClass } from './customresourcefactory';

class MobileServiceBinding {
  constructor(customResources) {
    this.customResources = customResources;
    this.isResourceOwnedBy = (cr, ownerName) => !ownerName || cr.isOwner(ownerName);
    this.getResource = (appName, statusCheck) =>
      find(this.customResources, cr => this.isResourceOwnedBy(cr, appName) && statusCheck(cr));
  }

  isBindingOperationInProgress = appName => !!this.getResource(appName, cr => cr.isInProgress());

  isBindingOperationFailed = appName => !!this.getResource(appName, cr => cr.isFailed());

  isBound = appName => !!this.getResource(appName, cr => cr.isReady());

  getBindingOperation = appName => {
    const inprogressCR = this.getResource(appName, cr => cr.isInProgress());
    if (inprogressCR) {
      return inprogressCR.getCurrentOperation();
    }
    return undefined;
  };
}

export class MobileService {
  constructor(json = {}) {
    this.data = json;
    this.configuration = this.data.configuration || [];
    this.configurationExt = this.data.configurationExt || [];
    this.setupText = '';

    if (this.data.bindCustomResource) {
      this.customResourceClass = newCustomResourceClass(this.data);
    }

    this.customResources = [];
    if (this.data.customResources) {
      for (const customResource of this.data.customResources) {
        this.customResources.push(newCustomResource(this.data, customResource));
      }
    }

    this.bindings = new MobileServiceBinding(this.customResources);
  }

  getName = () => this.data.name;

  getId = () => this.data.name;

  getDescription = () => this.data.description;

  getLogoURLBlackAndWhite() {
    return this.data.iconBlackAndWhite;
  }

  getIconClass() {
    return this.data.iconClass;
  }
  getLogoUrl = () => this.data.icon;

  getIconClass = () => this.data.iconClass;

  isBound = () => this.bindings.isBound();

  isBoundToApp = appName => this.bindings.isBound(appName);

  getCustomResourcesForApp = appName => filter(this.customResources, cr => cr.isOwner(appName));

  getServiceInstanceName = () => this.data.name;

  getSetupText = () => this.setupText;

  getBindingForm = params => this.customResourceClass.bindForm(params);

  isBindingOperationInProgress = appName => this.bindings.isBindingOperationInProgress(appName);

  getBindingOperation = appName => this.bindings.getBindingOperation(appName);

  isBindingOperationFailed = appName => this.bindings.isBindingOperationFailed(appName);

  isUPSService = () => this.data.type === 'push';

  customResourceDef = () => this.data.bindCustomResource;

  newCustomResource = formdata => this.customResourceClass.newInstance({ ...formdata });

  getConfiguration(appName) {
    const crs = this.getCustomResourcesForApp(appName);
    const configurations = reduce(crs, (all, cr) => all.concat(cr.getConfiguration(this.data.host)), []);
    const uniqConfigs = uniqBy(configurations, config => config.label);
    return uniqConfigs;
  }

  getConfigurationExt = () => this.data.configurationExt;

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

  /**
   * Return the docuemntation URL for this service. Firs try to load from an enviroment variable,
   * otherwise default to the upstream URL.
   *
   * @returns the service documentation URL
   * @memberof MobileService
   */
  getDocumentationUrl() {
    let url = this.data.documentationUrl;
    if (this.data.documentationUrl && !this.data.documentationUrl.startsWith('http')) {
      url = `https://${url}`;
    }

    return url || this.customResourceClass.getDocumentationUrl();
  }

  toJSON = () => ({
    ...this.data,
    configuration: this.configuration,
    configurationExt: this.configurationExt
  });
}
