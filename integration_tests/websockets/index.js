const WebSocket = require("ws");
const assert = require("assert");
const { connect, watchForWebSocketMessage } = require("../util/websockets");
const {
  createBinding,
  deleteBinding,
  getBindingTemplate
} = require("../util/bindingUtils");
const timeout = require("../util/awaitTimeout");
const sendRequest = require("../util/sendRequest");

const paths = {
  builds: "/builds/watch",
  apps: "/mobileclients/watch",
  buildConfigs: "/buildconfigs/watch",
  services: "/serviceinstances/watch",
  bindableservices: mobileClientName =>
    `/bindableservices/${mobileClientName}/watch`
};

const template = {
  name: "integration-websocket-test-client"
};

async function createClient(template) {
  const response = await sendRequest("POST", "mobileclients", template);
  assert.equal(response.status, 200, "client wasn't created successfully");
}

async function deleteClient(template) {
  res = await sendRequest("DELETE", `mobileclients/${template.name}`);
  assert.equal(res.status, 200);
}

describe("apps websocket watch", done => {
  let ws;
  before(async () => {
    ws = await connect(paths.apps);
  });
  it("should create new client and receive the changes", async () => {
    assert.equal(ws.readyState, WebSocket.OPEN);
    await Promise.all([
      watchForWebSocketMessage(ws, "MobileAppsEvent", 50000),
      createClient(template)
    ]);
  });
  after("deletes client and closes websocket connection", async () => {
    ws.close();
    await deleteClient(template);
  });
});

describe("bindings  websocket watch", async () => {
  let ws, bindingTemplate, bindingNameForDeletion;
  before("create client", async () => {
    await createClient(template);
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
    const service = res.data.items.find(i => i.name === "Mobile Metrics");
    assert.ok(service, "expected Metrics service");
    bindingTemplate = getBindingTemplate(template.name, service, "metrics", {
      CLIENT_TYPE: "public"
    });
  });
  beforeEach("connect websocket", async () => {
    ws = await connect(paths.bindableservices(template.name));
  });
  it("create binding and receive the changes", async () => {
    assert.equal(ws.readyState, WebSocket.OPEN);
    const result = await Promise.all([
      watchForWebSocketMessage(ws, "ADDED", 60000),
      createBinding(template.name, bindingTemplate, "Mobile Metrics")
    ]);
    bindingNameForDeletion = result[1];
    assert.equal(typeof(bindingNameForDeletion),'string','Name of binding template should be returned.');
  });
  it("delete binding and receive the changes", async () => {
    assert.equal(ws.readyState, WebSocket.OPEN);
    await Promise.all([
      watchForWebSocketMessage(ws, "DELETED", 60000),
      deleteBinding(template.name, bindingNameForDeletion, "Mobile Metrics")
    ]);
  });
  afterEach("disconnect websocket", async () => {
    if (ws) ws.close();
  });
  after("deletes client", async () => {
    await deleteClient(template);
  });
});
