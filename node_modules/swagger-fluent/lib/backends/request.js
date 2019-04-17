'use strict'

const request = require('request')

class Request {
  /**
   * Internal representation of HTTP request object.
   *
   * @param {object} options - Options object
   * @param {string} options.url - Base API URL
   * @param {object} options.auth - request library auth object
   * @param {string} options.ca - Certificate authority
   * @param {string} options.cert - Client certificate
   * @param {string} options.key - Client key
   */
  constructor (options) {
    this.requestOptions = options.request || {}
    this.requestOptions.baseUrl = options.url
    this.requestOptions.ca = options.ca
    this.requestOptions.cert = options.cert
    this.requestOptions.key = options.key
    if (options.auth) {
      this.requestOptions.auth = options.auth
    }
  }

  /**
   * @typedef {object} ApiRequestOptions
   * @property {object} body - Request body
   * @property {object} headers - Headers object
   * @property {string} path - version-less path
   * @property {object} qs - {@link https://www.npmjs.com/package/request#requestoptions-callback|
   *                          request query parameter}
   */

  /**
   * Invoke a REST request against the API server
   * @param {string} method - HTTP method, passed directly to `request`
   * @param {ApiRequestOptions} options - Options object
   * @param {callback} cb - The callback that handles the response
   * @returns {Stream} If cb is falsy, return a stream
   */
  http (options) {
    const uri = options.pathname
    const requestOptions = Object.assign({
      method: options.method,
      uri: uri,
      body: options.body,
      json: true,
      qs: options.parameters || options.qs,
      headers: options.headers
    }, this.requestOptions)

    if (options.stream) return request(requestOptions)

    return new Promise((resolve, reject) => {
      request(requestOptions, (err, res, body) => {
        if (err) return reject(err)
        return resolve(res)
      })
    })
  }
}

module.exports = Request
