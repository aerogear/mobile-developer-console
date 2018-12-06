const _ = require('lodash');

const DNS1123_SUBDOMAIN_VALIDATION = {
  pattern: /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
  maxlength: 253,
  description:
    'Name must consist of lower-case letters, numbers, periods, and hyphens. It must start and end with a letter or a number.'
};

const createSecretName = prefix => {
  const secretNamePrefixMaxLength = DNS1123_SUBDOMAIN_VALIDATION.maxlength - 6; // We append a 5 digit code and a -;

  if (prefix.length > secretNamePrefixMaxLength) {
    prefix = prefix.substring(0, secretNamePrefixMaxLength);
  }

  const randomString = Math.round(36 ** 6 - Math.random() * 36 ** 6)
    .toString(36)
    .slice(1);

  prefix += `-${randomString}`;
  return prefix;
}

const isBindingFailed = binding => {
  const conditions = binding.status.conditions;
  return conditions && _.find(conditions, { type: 'Failed', status: 'True' });
};

const isBindingInProgress = binding => {
  const conditions = binding.status.conditions;
  return conditions &&
    _.find(conditions, { type: 'Ready', status: 'False' }) &&
    !isBindingFailed(binding);
};

const isBindingReady = binding => {
  const conditions = binding.status.conditions;
  return conditions && _.find(conditions, { type: 'Ready', status: 'True' });
};

const isServiceBindingFailed = service => {
  const failedBinding = _.find(service.serviceBindings, binding => isBindingFailed(binding));
  return failedBinding != null;
};

const isServiceBindingInProgress = service => {
  const inprogressBinding = _.find(service.serviceBindings, binding => isBindingInProgress(binding));
  return inprogressBinding != null;
};

const isServiceBound = service => {
  const boundBinding = _.find(service.serviceBindings, binding => isBindingReady(binding));
  return boundBinding != null;
};

const getMetricsBindingTemplate = (appName, service) => {
  const template = {
    bindingParametersName: null,
    bindingSecretName: null,
    formData: {
      CLIENT_ID: appName,
      CLIENT_TYPE: 'public'
    },
    serviceClassExternalName: 'metrics',
    serviceInstanceName: null
  };
  const credentialSecretName = createSecretName(
    `${service.serviceInstance.metadata.name}-credentials`
  );
  const parametersSecretName = createSecretName(
    `${service.serviceInstance.metadata.name}-bind-parameters`
  );
  template.bindingParametersName = parametersSecretName;
  template.bindingSecretName = credentialSecretName;
  template.serviceInstanceName = service.serviceInstance.metadata.name;
  return template;
};

module.exports = {
  createSecretName,
  isBindingFailed,
  isBindingInProgress,
  getMetricsBindingTemplate,
  isBindingReady,
  isServiceBindingFailed,
  isServiceBindingInProgress,
  isServiceBound
};