const timeout = require("./awaitTimeout");
const assert = require("assert");

async function waitOnMessage(connection, messageBody, timeoutDelay = 5000) {
  return await Promise.race([
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
    timeout(timeoutDelay)
  ]);
}

/**
 * Watches for the WebSocket message with specified content.
 * @param {WebSocketConnection} connection websocket connection
 * @param {String} messageBody what is watched
 * @returns {promise}
 */
async function watchForWebSocketMessage(
  connection,
  messageBody,
  timeoutDelay = 5000
) {
  const message = await waitOnMessage(connection, messageBody, timeoutDelay);
  assert.notEqual(
    message,
    undefined,
    `Proper message "${messageBody}" not received while timeout`
  );
  console.info(`Message "${message}" received`);
}

/**
 * Connects to the websocket.
 * @param {WebSocketClient} client websocket client
 * @param {String} path server path for the API
 * @returns {WebSocketConnection} connection
 */
async function connect(client, path) {
  client.connect(`ws://localhost:4000/api${path}`);
  return await new Promise((resolve, reject) => {
    client.on("connect", resolve);
    client.on("connectFailed", reject);
  });
}

module.exports = {
  connect,
  watchForWebSocketMessage
};
