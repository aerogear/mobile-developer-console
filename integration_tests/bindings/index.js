const assert = require('assert');
const sendRequest = require('../util/sendRequest');
const bindingUtils = require('../util/bindingUtils');

const createBinding = async (appName, template) => {
  const res = await sendRequest('POST', 'bindableservices', template)
  assert.equal(res.status, 200, 'request for new binding should be successful');
  const bindingName = res.data.metadata.name;
  
  let bindingRes;
  let timeout = 6 * 60 * 1000;
  while ((!bindingRes || !bindingUtils.isServiceBound(bindingRes.data.items[0])) && timeout > 0) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    timeout -= 5000;
    bindingRes = await sendRequest('GET', `bindableservices/${appName}`);
    assert.equal(bindingRes.status, 200, 'request for list of bindings should be successful');
  }
  assert(bindingUtils.isServiceBound(bindingRes.data.items[0]), 'service should be bound in less than 3 minutes');

  return bindingName;
};

const deleteBinding = async (appName, bindingName) => {
  const deleteRes = await sendRequest('DELETE', `bindableservices/${bindingName}`);
  assert.equal(deleteRes.status, 200, 'request for binding deletion should be successful');

  bindingRes = null
  timeout = 6 * 60 * 1000;
  while ((!bindingRes || bindingUtils.isServiceBindingInProgress(bindingRes.data.items[0])) && timeout > 0) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    timeout -= 5000;
    bindingRes = await sendRequest('GET', `bindableservices/${appName}`);
    assert.equal(bindingRes.status, 200, 'request for list of bindings should be successful');
  }
  assert(!bindingUtils.isServiceBound(bindingRes.data.items[0]), 'service should be unbound in less than 3 minutes');
  assert(!bindingUtils.isServiceBindingInProgress(bindingRes.data.items[0]), 'binding operation should not be in progress');
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
    assert.equal(res.data.items.length, 1, 'there should be one bindable service');
    assert.equal(res.data.items[0].name, 'Mobile Metrics', 'expected Metrics service');
    bindingTemplate = bindingUtils.getMetricsBindingTemplate(clientTemplate.name, res.data.items[0]);
  });
  
  after('delete mobile app', async function() {
    const res = await sendRequest('DELETE', `mobileclients/${clientTemplate.name}`);
    assert.equal(res.status, 200);
  });

  it('should succeed and update mobile-services.json correctly', async function() {
    const bindingName = await createBinding(clientTemplate.name, bindingTemplate);

    const clientRes = await sendRequest('GET', `mobileclients/${clientTemplate.name}`);
    assert.equal(clientRes.status, 200, 'request for app should be successful');
    assert.equal(
      clientRes.data.status.services[0].type,
      'metrics',
      'mobile-services.json should contain config for bound service'
    );

    await deleteBinding(clientTemplate.name, bindingName);
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
    bindingTemplate1 = bindingUtils.getMetricsBindingTemplate(clientTemplate1.name, res.data.items[0]);
    bindingName1 = await createBinding(clientTemplate1.name, bindingTemplate1);

    res = await sendRequest('GET', `bindableservices/${clientTemplate2.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app2 should be successful');
    bindingTemplate2 = bindingUtils.getMetricsBindingTemplate(clientTemplate2.name, res.data.items[0]);
    bindingName2 = await createBinding(clientTemplate2.name, bindingTemplate2);
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
    assert.equal(res.data.items[0].serviceBindings[0].metadata.name, bindingName1, 'should be correct binding for app1');

    res = await sendRequest('GET', `bindableservices/${clientTemplate2.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app2 should be successful');
    assert.equal(res.data.items[0].serviceBindings[0].metadata.name, bindingName2, 'should be correct binding for app2');

    await deleteBinding(clientTemplate2.name, bindingName2);
    res = await sendRequest('GET', `bindableservices/${clientTemplate1.name}`);
    assert.equal(res.status, 200, 'request for bindable services for app1 should be successful');
    assert.equal(res.data.items[0].serviceBindings[0].metadata.name, bindingName1, 'binding for app1 should stay');
  });
});