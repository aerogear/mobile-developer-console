const { exec } = require('child_process')

process.env.NAMESPACE = process.env.NAMESPACE || "mdc-integration-testing"
process.env.KUBERNETES_CONFIG = process.env.KUBERNETES_CONFIG || `${process.env.HOME}/.kube/config`

let goOutput

// // Spin up backend server on port 4000
// before( function(done) {
//   this.timeout(30000)
//   goOutput = exec('../mobile-developer-console')
//   goOutput.stdout.on('data', data => {
//     console.log(data.toString())
//   })
//   goOutput.stderr.on('data', data => {
//     const message = data.toString()
//     console.log(message)
//     if (message.indexOf("Starting application") > -1) {
//       done()
//     }
//   })
// });

// after(() => {
//   goOutput.kill("SIGINT")
// })

describe('Mobile Clients', () => {
  require('./mobile_clients')
});

describe('Service Bindings', () => {
  require('./bindings');
});

describe('Websocket updates', () => {
  require('./websockets');
});