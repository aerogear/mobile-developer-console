'use strict'

const { URL, URLSearchParams } = require('url')

class FetchClient {
  /**
   * Fetch API client.
   * @param {object} options
   * @param {function} options.fetch - fetch function.
   * @param {string} options.url - Base URL for API.
   */
  constructor ({ fetch, url }) {
    this.fetch = fetch
    this.url = url
  }

  /**
   * Invoke API request.
   * @param {object} options - options object.
   * @param {object} options.body - JSONifable object.
   * @param {string} options.method - HTTP method.
   * @param {string} options.pathItemObject - Swagger/OpenAPI Path Item Object.
   * @param {object} options.parameters - named query parameters.
   * @param {object} options.qs - named query parameters (legacy).
   * @param {string} options.pathname - URL pathname.
   * @param {boolean} options.stream - true if called by a "stream method".
   */
  http (options) {
    const body = JSON.stringify(options.body)
    const url = new URL(this.url)
    url.pathname += options.pathname
    const searchParams = new URLSearchParams(options.parameters || options.qs)
    url.search = searchParams

    return this.fetch(url.href, {
      body,
      method: options.method
    })
  }
}

module.exports = FetchClient
