# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.1.4](https://github.com/silasbw/swagger-fluent/compare/3.1.3...3.1.4) (2019-05-20)


### Bug Fixes

* **parameters:** fix passing pathname parameters to backends ([#33](https://github.com/silasbw/swagger-fluent/issues/33)) ([d74f27c](https://github.com/silasbw/swagger-fluent/commit/d74f27c))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/silasbw/swagger-fluent/compare/3.1.0...3.1.1) (2018-12-29)


### Bug Fixes

* **loading:** don't fail if Path Item Object already exists ([#27](https://github.com/silasbw/swagger-fluent/issues/27)) ([8a04b38](https://github.com/silasbw/swagger-fluent/commit/8a04b38))



<a name="3.1.0"></a>
# [3.1.0](https://github.com/silasbw/fluent-openapi/compare/3.0.0...3.1.0) (2018-12-29)


### Features

* **backend:** pass Operation Object to backend ([#23](https://github.com/silasbw/fluent-openapi/issues/23)) ([d8820a7](https://github.com/silasbw/fluent-openapi/commit/d8820a7))
* **backend:** pass Path Item Object to backend ([#24](https://github.com/silasbw/fluent-openapi/issues/24)) ([551bdf8](https://github.com/silasbw/fluent-openapi/commit/551bdf8))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/silasbw/fluent-openapi/compare/2.0.0...3.0.0) (2018-12-24)


### Code Refactoring

* **backend:** rename "clients" to "backend" ([#20](https://github.com/silasbw/fluent-openapi/issues/20)) ([2d01f73](https://github.com/silasbw/fluent-openapi/commit/2d01f73))


### Features

* **fetch:** add a reference client using fetch ([#14](https://github.com/silasbw/fluent-openapi/issues/14)) ([2c9ebae](https://github.com/silasbw/fluent-openapi/commit/2c9ebae))
* **parameters:** track pathname parameters and pass to the handler ([#17](https://github.com/silasbw/fluent-openapi/issues/17)) ([023252b](https://github.com/silasbw/fluent-openapi/commit/023252b))
* **swagger:** add a swagger-js based client ([#18](https://github.com/silasbw/fluent-openapi/issues/18)) ([036307d](https://github.com/silasbw/fluent-openapi/commit/036307d))


### BREAKING CHANGES

* **backend:** renamed Client `.http` option to `.backend`



<a name="2.0.0"></a>
# [2.0.0](https://github.com/silasbw/fluent-openapi/compare/1.0.0...2.0.0) (2018-12-12)


### Bug Fixes

* **handler:** call handler with all options (not just select ones) ([#13](https://github.com/silasbw/fluent-openapi/issues/13)) ([ee45108](https://github.com/silasbw/fluent-openapi/commit/ee45108))


### Features

* **getPath:** add method to get the Component path as a string ([#10](https://github.com/silasbw/fluent-openapi/issues/10)) ([f8d04d0](https://github.com/silasbw/fluent-openapi/commit/f8d04d0))
* **request:** update request handling interface and implementation ([#11](https://github.com/silasbw/fluent-openapi/issues/11)) ([e65679b](https://github.com/silasbw/fluent-openapi/commit/e65679b))


### BREAKING CHANGES

* **request:** be less `request` specific to help facilitate integrations
with Fetch or swagger-js.



<a name="1.0.0"></a>
# [1.0.0](https://github.com/silasbw/fluent-openapi/compare/0.1.1...1.0.0) (2018-10-31)


### Chores

* **loadSpec:** remove ([#1](https://github.com/silasbw/fluent-openapi/issues/1)) ([c7cb791](https://github.com/silasbw/fluent-openapi/commit/c7cb791))


### BREAKING CHANGES

* **loadSpec:** removing loadSpec



<a name="0.1.1"></a>
## [0.1.1](https://github.com/silasbw/fluent-openapi/compare/0.1.0...0.1.1) (2018-08-27)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/silasbw/fluent-openapi/compare/0.0.1...0.1.0) (2018-08-27)


### Features

* **getNames:** a callback hook to alias paths ([2da4478](https://github.com/silasbw/fluent-openapi/commit/2da4478))
