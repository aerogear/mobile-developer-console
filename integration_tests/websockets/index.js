const WebSocketClient = require("websocket").client;
const assert = require("assert");
const client = new WebSocketClient();
const paths = {
  builds: "/builds/watch",
  apps: "/mobileclients/watch",
  buildConfigs: "/buildconfigs/watch",
  services: "/serviceinstances/watch",
  bindableservices: mobileClientName =>
    `/bindableservices/${mobileClientName}/watch`
};

const sendRequest = require("../util/sendRequest");
const timeout = require("../util/awaitTimeout");

const template = {
  name: "integration-websocket-test-client"
};

function onMessage(connection, messageBody) {
  return Promise.race([
    new Promise(resolve => {
      connection.on("message", message => {
        if (message.utf8Data === messageBody) resolve(message);
        else
          console.info(
            `not catching message "${
              message.utf8Data
            }" required "${messageBody}"`
          );
      });
    }),
    timeout(5000)
  ]);
}

function watchForWebSocketMessage(connection, messageBody, done) {
  onMessage(connection, messageBody)
    .then(message => {
      assert.notEqual(
        message,
        undefined,
        `Proper message "${messageBody}" not received while timeout`
      );
    })
    .then(done, done);
}

/**
 *
 * @param {String} client
 * @param {String} path
 * @returns {}
 */
async function connect(client, path) {
  client.connect(`ws://localhost:3000/api${path}`);
  return await new Promise((resolve, reject) => {
    client.on("connect", resolve);
    client.on("connectFailed", reject);
  });
}

describe("apps websocket watch", async () => {
  let connection;
  before(async () => {
    connection = await connect(
      client,
      paths.apps
    );
  });
  it("should create new client and watch for changes", done => {
    assert.equal(connection.connected, true);
    sendRequest("POST", "mobileclients", template);
    watchForWebSocketMessage(connection, "MobileAppsEvent", done);
  });
  after(async () => {
    res = await sendRequest("DELETE", `mobileclients/${template.name}`);
    assert.equal(res.status, 200);
    connection.close();
  });
});
