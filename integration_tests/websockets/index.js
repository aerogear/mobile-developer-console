const WebSocketClient = require("websocket").client;
const assert = require("assert");
const client = new WebSocketClient();
const { connect, watchForWebSocketMessage } = require("../util/websockets");
const { createBinding, deleteBinding } = require("../bindings");
const bindingUtils = require("../util/bindingUtils");

const paths = {
  builds: "/builds/watch",
  apps: "/mobileclients/watch",
  buildConfigs: "/buildconfigs/watch",
  services: "/serviceinstances/watch",
  bindableservices: mobileClientName =>
    `/bindableservices/${mobileClientName}/watch`
};

const sendRequest = require("../util/sendRequest");

const template = {
  name: "integration-websocket-test-client"
};

async function deleteAndClose(connection, template) {
  res = await sendRequest("DELETE", `mobileclients/${template.name}`);
  assert.equal(res.status, 200);
  if (connection) connection.close();
}

describe("apps websocket watch", async () => {
  let connection;
  before(async () => {
    connection = await connect(
      client,
      paths.apps
    );
  });
  it("should create new client and receive the changes", done => {
    assert.equal(connection.connected, true);
    watchForWebSocketMessage(connection, "MobileAppsEvent").then(done, done);
    sendRequest("POST", "mobileclients", template);
  });
  after("deletes client and closes websocket connection", async () => {
    deleteAndClose(connection, template);
  });
});

describe("bindings  websocket watch", async () => {
  let connection, bindingTemplate, bindingNameForDeletion;
  before("create client", async () => {
    await sendRequest("POST", "mobileclients", template);
    connection = await connect(
      client,
      paths.bindableservices(template.name)
    );
  });
  before("prepare binding template", async () => {
    let res = await sendRequest("GET", `bindableservices/${template.name}`);
    assert.equal(
      res.status,
      200,
      `"request for bindable services for "${
        template.name
      }" should be successful`
    );
    bindingTemplate = bindingUtils.getMetricsBindingTemplate(
      template.name,
      res.data.items[0]
    );
  });
  it("create binding and receive the changes", done => {
    assert.equal(connection.connected, true);
    createBinding(template.name, bindingTemplate)
      .then(bindingName => {
        bindingNameForDeletion = bindingName;
      })
      .then(watchForWebSocketMessage(connection, "ADDED"))
      .then(done, done);
  });
  it("delete binding and receive the changes", done => {
    assert.equal(connection.connected, true);
    deleteBinding(template.name, bindingNameForDeletion)
      .then(watchForWebSocketMessage(connection, "DELETED"))
      .then(done, done);
  });
  after("deletes client and closes websocket connection", async () => {
    deleteAndClose(connection, template);
  });
});
