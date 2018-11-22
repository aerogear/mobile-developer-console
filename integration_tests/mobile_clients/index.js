const assert = require('assert')
const sendRequest = require('../util/sendRequest')

const template = {
  name: "integration-test-client"
}

describe('initially', () => {
  it('should have no mobile clients present', async () => {
    const res = await sendRequest('GET', 'mobileclients')
    assert.equal(res.status, 200)
    assert.equal(res.data.items.length, 0)
  });
});

describe('when creating a new client', () => {
  let res;
  it('should be created without error', async () => {
    res = await sendRequest('POST', 'mobileclients', template)
    assert.equal(res.status, 200)
  });

  it('created client should have required metadata', () => {
    assert.equal(res.data.metadata.name, template.name)
    assert.equal(res.data.spec.name, template.name)
    assert.equal(res.data.status.clientId, template.name)
  });

});

describe('when listing a client', () => {
  let res;
  it('should be listed without error', async () => {
    res = await sendRequest('GET', 'mobileclients')
    assert.equal(res.status, 200)
  });

  it('listed client should have required metadata', () => {
    const listedClientData = res.data.items[0]
    assert.equal(listedClientData.metadata.name, template.name)
    assert.equal(listedClientData.spec.name, template.name)
    assert.equal(listedClientData.status.clientId, template.name)
  });

});

describe('when deleting a client', () => {
  let res;
  it('should be deleted without error', async () => {
    res = await sendRequest('DELETE', `mobileclients/${template.name}`)
    assert.equal(res.status, 200)
  });

  it('deleted client should be no longer present in the list', async () => {
    res = await sendRequest('GET', 'mobileclients')
      assert.equal(res.status, 200)
      assert.equal(res.data.items.length, 0)
  });

});
