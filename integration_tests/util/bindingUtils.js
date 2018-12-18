const _ = require('lodash');
const sendRequest = require("./sendRequest");
const assert = require("assert");

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

const isUPSFullyBound = service => {
  return _.every(service.serviceBindings, binding => isBindingReady(binding));
};

const getBindingTemplate = (appName, service, serviceName, formData) => {
  const template = {
    bindingParametersName: null,
    bindingSecretName: null,
    formData: {
      CLIENT_ID: appName,
      ...formData
    },
    serviceClassExternalName: serviceName,
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

const createBinding = async (appName, template, serviceName, isBound = isServiceBound) => {
  const res = await sendRequest('POST', 'bindableservices', template)
  assert.equal(res.status, 200, 'request for new binding should be successful');
  const bindingName = res.data.metadata.name;
  
  let service;
  let timeout = 6 * 60 * 1000;
  while ((!service || !isBound(service)) && timeout > 0) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    timeout -= 5000;
    const bindingRes = await sendRequest('GET', `bindableservices/${appName}`);
    assert.equal(bindingRes.status, 200, 'request for list of bindings should be successful');
    service = bindingRes.data.items.find(i => i.name === serviceName);
  }
  assert(isBound(service), 'service should be bound in less than 3 minutes');

  return bindingName;
};

const deleteBinding = async (appName, bindingName, serviceName, boundCheck = true) => {
  const deleteRes = await sendRequest('DELETE', `bindableservices/${bindingName}`);
  assert.equal(deleteRes.status, 200, 'request for binding deletion should be successful');

  let service;
  let timeout = 6 * 60 * 1000;
  while ((!service || isServiceBindingInProgress(service)) && timeout > 0) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    timeout -= 5000;
    const bindingRes = await sendRequest('GET', `bindableservices/${appName}`);
    assert.equal(bindingRes.status, 200, 'request for list of bindings should be successful');
    service = bindingRes.data.items.find(i => i.name === serviceName);
  }
  if (boundCheck) {
    assert(!isServiceBound(service), 'service should be unbound in less than 3 minutes');
  }
  assert(!isServiceBindingInProgress(service), 'binding operation should not be in progress');
};

module.exports = {
  createSecretName,
  isBindingFailed,
  isBindingInProgress,
  getBindingTemplate,
  isBindingReady,
  isServiceBindingFailed,
  isServiceBindingInProgress,
  isServiceBound,
  isUPSFullyBound,
  createBinding,
  deleteBinding
};