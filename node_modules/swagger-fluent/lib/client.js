const Component = require('./loader')
const Request = require('./backends/request')

class Client {
  constructor (options) {
    const backend = options.backend || new Request(options.config)
    const root = new Component({ splits: [], backend, getNames: options.getNames })
    if (options.spec) root._addSpec(options.spec)
    return root
  }
}

module.exports = Client
