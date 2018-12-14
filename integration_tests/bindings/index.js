const assert = require('assert');
const sendRequest = require('../util/sendRequest');
const bindingUtils = require('../util/bindingUtils');

const createBinding = async (appName, template, serviceName, isBound = bindingUtils.isServiceBound) => {
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
  while ((!service || bindingUtils.isServiceBindingInProgress(service)) && timeout > 0) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    timeout -= 5000;
    const bindingRes = await sendRequest('GET', `bindableservices/${appName}`);
    assert.equal(bindingRes.status, 200, 'request for list of bindings should be successful');
    service = bindingRes.data.items.find(i => i.name === serviceName);
  }
  if (boundCheck) {
    assert(!bindingUtils.isServiceBound(service), 'service should be unbound in less than 3 minutes');
  }
  assert(!bindingUtils.isServiceBindingInProgress(service), 'binding operation should not be in progress');
};

describe('binding creation/deletion', function() {
  this.timeout(0);

  const clientTemplate = {
    name: 'test'
  };
  
  let bindingTemplate;

  before('create mobile app', async function() {
    const res = await sendRequest('POST', 'mobileclients', clientTemplate);
    assert.equal(res.status, 200);
  });

  before('get bindable service', async function() {
    const res = await sendRequest('GET', `bindableservices/${clientTemplate.name}`);
    assert.equal(res.status, 200, 'request for bindable services should be successful');
    const service = res.data.items.find(i => i.name === 'Mobile Metrics');
    assert.ok(service, 'expected Metrics service');
    bindingTemplate = bindingUtils.getBindingTemplate(clientTemplate.name, service, 'metrics', { CLIENT_TYPE: 'public' });
  });
  
  after('delete mobile app', async function() {
    const res = await sendRequest('DELETE', `mobileclients/${clientTemplate.name}`);
    assert.equal(res.status, 200);
  });

  it('should update mobile-services.json correctly', async function() {
    const bindingName = await createBinding(clientTemplate.name, bindingTemplate, 'Mobile Metrics');

    let clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.equal(
      clientRes.data.status.services[0].type,
      'metrics',
      'mobile-services.json should contain config for bound service'
    );

    await deleteBinding(clientTemplate.name, bindingName, 'Mobile Metrics');

    clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.equal(
      clientRes.data.status.services.length,
      0,
      'mobile-services.json should not contain any bound services'
    );
  });
});

describe('bindings for different apps', function() {
  this.timeout(0);

  const clientTemplate1 = { name: 'test1' };
  const clientTemplate2 = { name: 'test2' };

  let bindingTemplate1;
  let bindingTemplate2;

  let bindingName1;
  let bindingName2;

  before('create 2 apps', async function() {
    const res1 = await sendRequest('POST', 'mobileclients', clientTemplate1);
    assert.equal(res1.status, 200);
    const res2 = await sendRequest('POST', 'mobileclients', clientTemplate2);
    assert.equal(res2.status, 200);
  });

  before('create bindings', async function() {
    let res = await sendRequest('GET', `bindableservices/${clientTemplate1.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app1 should be successful');
    let service = res.data.items.find(i => i.name === 'Mobile Metrics');
    bindingTemplate1 = bindingUtils.getBindingTemplate(clientTemplate1.name, service, 'metrics', { CLIENT_TYPE: 'public' });
    bindingName1 = await createBinding(clientTemplate1.name, bindingTemplate1, 'Mobile Metrics');

    res = await sendRequest('GET', `bindableservices/${clientTemplate2.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app2 should be successful');
    service = res.data.items.find(i => i.name === 'Mobile Metrics');
    bindingTemplate2 = bindingUtils.getBindingTemplate(clientTemplate2.name, service, 'metrics', { CLIENT_TYPE: 'public' });
    bindingName2 = await createBinding(clientTemplate2.name, bindingTemplate2, 'Mobile Metrics');
  });

  after('delete apps', async function() {
    let res = await sendRequest('DELETE', `mobileclients/${clientTemplate1.name}`);
    assert.equal(res.status, 200);
    res = await sendRequest('DELETE', `mobileclients/${clientTemplate2.name}`);
    assert.equal(res.status, 200);
  });

  it('should list correct bindings for each app', async function() {
    let res = await sendRequest('GET', `bindableservices/${clientTemplate1.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app1 should be successful');
    let service = res.data.items.find(i => i.name === 'Mobile Metrics');
    assert.equal(service.serviceBindings[0].metadata.name, bindingName1, 'should be correct binding for app1');

    res = await sendRequest('GET', `bindableservices/${clientTemplate2.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app2 should be successful');
    service = res.data.items.find(i => i.name === 'Mobile Metrics');
    assert.equal(service.serviceBindings[0].metadata.name, bindingName2, 'should be correct binding for app2');

    await deleteBinding(clientTemplate2.name, bindingName2, 'Mobile Metrics');
    res = await sendRequest('GET', `bindableservices/${clientTemplate1.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app1 should be successful');
    service = res.data.items.find(i => i.name === 'Mobile Metrics');
    assert.equal(service.serviceBindings[0].metadata.name, bindingName1, 'binding for app1 should stay');
  });
});

describe('delete app', function() {
  this.timeout(0);

  const clientTemplate = {
    name: 'test3'
  };

  let bindingTemplate;
  let bindingName;

  before('create app', async function() {
    const res = await sendRequest('POST', 'mobileclients', clientTemplate);
    assert.equal(res.status, 200);
  });

  before('create binding', async function() {
    let res = await sendRequest('GET', `bindableservices/${clientTemplate.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app should be successful');
    const service = res.data.items.find(i => i.name === 'Mobile Metrics');
    bindingTemplate = bindingUtils.getBindingTemplate(clientTemplate.name, service, 'metrics', { CLIENT_TYPE: 'public' });
    bindingName = await createBinding(clientTemplate.name, bindingTemplate, 'Mobile Metrics');
  });

  it('should delete also binding when deleting app', async function() {
    let res = await sendRequest('DELETE', `mobileclients/${clientTemplate.name}`);
    assert.equal(res.status, 200);

    let deleteRes = null
    let timeout = 6 * 60 * 1000;
    while ((!deleteRes || deleteRes.status !== 500) && timeout > 0) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      timeout -= 5000;
      deleteRes = await sendRequest('DELETE', `bindableservices/${bindingName}`);
    }
    assert.equal(deleteRes.status, 500, 'binding should already be deleted');
  });
});

describe('UPS bindings', function() {
  this.timeout(0);

  const clientTemplate = {
    name: 'test4'
  };

  let bindingTemplateAndroid;
  let bindingTemplateIOS;

  before('create app', async function() {
    const res = await sendRequest('POST', 'mobileclients', clientTemplate);
    assert.equal(res.status, 200);
  });

  before('prepare Android push binding template', async function() {
    const res = await sendRequest('GET', `bindableservices/${clientTemplate.name}`);
    assert.equal(res.status, 200, 'request for bindable services should be successful');
    const service = res.data.items.find(i => i.name === 'Push Notifications');
    assert.ok(service, 'expected UPS service');

    bindingTemplateAndroid = bindingUtils.getBindingTemplate(clientTemplate.name, service, 'ups', {
      CLIENT_TYPE: 'Android',
      googlekey: 'abcdefghijk-abcdefghijklmnopqrstuvwxyz1',
      iosIsProduction: false,
      projectNumber: '123456789012'
    });
  });

  before('prepare iOS push binding template', async function() {
    const res = await sendRequest('GET', `bindableservices/${clientTemplate.name}`);
    assert.equal(res.status, 200, 'request for bindable services should be successful');
    const service = res.data.items.find(i => i.name === 'Push Notifications');
    assert.ok(service, 'expected UPS service');

    bindingTemplateIOS = bindingUtils.getBindingTemplate(clientTemplate.name, service, 'ups', {
      CLIENT_TYPE: 'IOS',
      cert: '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',
      iosIsProduction: false,
      passphrase: 'pass'
    });
  });
  
  after('delete mobile app', async function() {
    const res = await sendRequest('DELETE', `mobileclients/${clientTemplate.name}`);
    assert.equal(res.status, 200);
  });

  it('should be possible to create for both Android and iOS', async function() {
    const bindingNameAndroid = await createBinding(clientTemplate.name, bindingTemplateAndroid, 'Push Notifications');

    let clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.equal(
      clientRes.data.status.services[0].type,
      'push',
      'mobile-services.json should contain config for UPS'
    );
    assert.ok(
      clientRes.data.status.services[0].config.android,
      'mobile-services.json should contain config for android'
    );

    const bindingNameIOS = await createBinding(clientTemplate.name, bindingTemplateIOS, 'Push Notifications', bindingUtils.isUPSFullyBound);

    clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.equal(
      clientRes.data.status.services[0].type,
      'push',
      'mobile-services.json should contain config for UPS'
    );
    assert.ok(
      clientRes.data.status.services[0].config.ios,
      'mobile-services.json should contain config for ios'
    );

    await deleteBinding(clientTemplate.name, bindingNameAndroid, 'Push Notifications', false);

    clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.ok(
      clientRes.data.status.services[0].config.ios,
      'mobile-services.json should contain config for ios'
    );
    assert.ok(
      !clientRes.data.status.services[0].config.android,
      'mobile-services.json should not contain config for android'
    );

    await deleteBinding(clientTemplate.name, bindingNameIOS, 'Push Notifications');

    clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.equal(
      clientRes.data.status.services.length,
      0,
      'mobile-services.json should not contain any bound services'
    );
  });
});
