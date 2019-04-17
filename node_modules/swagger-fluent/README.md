# swagger-fluent

[![Build Status][build]](https://travis-ci.org/silasbw/swagger-fluent) [![Greenkeeper badge][greenkeeper]](https://greenkeeper.io/)

[greenkeeper]: https://badges.greenkeeper.io/silasbw/swagger-fluent.svg
[build]: https://travis-ci.org/silasbw/swagger-fluent.svg?branch=master

A fluent OpenAPI and Swagger client for JavaScript and Node.js.

fluent-client represents [Path Item
Object](https://swagger.io/specification/#pathItemObject) with chains
of objects:

```
/api/v1/namespaces -> api.v1.namespaces
```

associates operations on a Path Item Object with functions:

```
/api/v1/namespaces -> api.v1.namespaces.get()
```

and represents [Path
Templating](https://swagger.io/specification/#pathTemplating) with
function calls:

```
/api/v1/namespaces/{namespace}/pods -> api.v1.namespaces(namespace).pods
```

Configurable "backends" handle executing API calls by, for example,
using [`fetch`](#fetchbackendoptions) or [Swagger
Client](#swaggerclientbackendoptions). A backend can also perform
error checking.  The Swagger Client backend, for example, will perform
the usual parameter and resolution checking that
[swagger-js](https://github.com/swagger-api/swagger-js) performs and
will throw those errors to the caller.

## Using

```js
const spec = require('./swagger.json')
const url = 'https://petstore.swagger.io/v2/'
const FetchBackend = require('swagger-fluent/backends/fetch')
const backend = new FetchBackend({ fetch, url })

const { Client } = require('swagger-fluent')
const client = new Client({ spec, backend })

const response = await client.pet.findByStatus.get({ parameters: { status: 'available' } })
```

## API

### `Client(options)`

Create a fluent client for an OpenAPI or Swagger specification.

* `options.spec` - OpenAPI or Swagger specification.
* `options.backend` - Object with an `.http` method that executes HTTP
r equests.
* `options.getNames(name, ancestors)` - a function to translate each
path name to an alternate name or array of names. You could, for
example, alias the resource "namespaces" to "namespace" and "ns".

### `FetchBackend(options)`

Create a [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)-based
backend.

* `options.fetch` - `fetch` function (*e.g.*,
[`node-fetch`](https://www.npmjs.com/package/node-fetch) or
[`whatwg-fetch`](https://www.npmjs.com/package/whatwg-fetch)).
* `options.url` - Base URL for HTTP API.

```js
const FetchBackend = require('swagger-fluent/backends/fetch')
```

### `RequestBackend(options)`

```js
const RequestBackend = require('swagger-fluent/backends/request')
```

### `SwaggerClientBackend(options)`

Create a [swagger-js](https://github.com/swagger-api/swagger-js)-based
backend.

```js
const SwaggetClientBackend = require('swagger-fluent/backends/swagger-client')
```

### Custom backend

The backend must implement an `.http` method. swagger-fluent passes
the following options to the `.http` method, and returns the result
directly to the API caller.

* `options.body` - JSONifable object.
* `options.method` - HTTP method.
* `options.pathItemObject` - Swagger/OpenAPI Path Item Object.
* `options.parameters` - named query parameters.
* `options.qs` - named query parameters (legacy).
* `options.pathname` - URL pathname.
* `options.stream` - true if called by a "stream method".
