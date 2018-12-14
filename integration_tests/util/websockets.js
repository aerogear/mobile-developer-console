const timeout = require("./awaitTimeout");
const assert = require("assert");
const WebSocket = require("ws");

async function waitOnMessage(ws, messageBody, timeoutDelay = 5000) {
  return await Promise.race([
    new Promise(resolve => {
      const startTime = new Date().getTime();
      ws.on("message", message => {
        const dieTime = new Date().getTime() - startTime;
        if (message === messageBody) {
          resolve(message);
        } else if (dieTime > timeoutDelay) resolve();
        else {
          console.info(
            `not catching message "${
              message
            }" required "${messageBody}" timeToDie=${timeoutDelay - dieTime}`
          );
        }
      });
    }),
    timeout(timeoutDelay)
  ]);
}

/**
 * Watches for the WebSocket message with specified content.
 * @param {WebSocket} ws websocket 
 * @param {String} messageBody what is watched
 * @returns {promise}
 */
async function watchForWebSocketMessage(
  ws,
  messageBody,
  timeoutDelay = 5000
) {
  const message = await waitOnMessage(ws, messageBody, timeoutDelay);
  assert.notEqual(
    message,
    undefined,
    `Proper message "${messageBody}" not received while timeout`
  );
  console.info(`Message "${message}" received`);
}

/**
 * Connects to the websocket.
 * @param {String} path server path for the API
 * @returns {WebSocket} connected websocket or error
 */
async function connect(path) {
  const ws = new WebSocket(`ws://localhost:4000/api${path}`);
  return await new Promise((resolve, reject) => {
    ws.on("open", () => resolve(ws));
    ws.on("error", reject);
  });
}

module.exports = {
  connect,
  watchForWebSocketMessage
};
