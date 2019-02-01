[![CircleCI](https://circleci.com/gh/aerogear/mobile-developer-console.svg?style=svg)](https://circleci.com/gh/aerogear/mobile-developer-console) [![Coverage Status](https://coveralls.io/repos/github/aerogear/mobile-developer-console/badge.svg?branch=master)](https://coveralls.io/github/aerogear/mobile-developer-console?branch=master)
[![](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/aerogearcatalog/mobile-developer-console-apb/)
[![Docker Stars](https://img.shields.io/docker/stars/aerogearcatalog/mobile-developer-console-apb.svg?style=plastic)](https://registry.hub.docker.com/v2/repositories/aerogearcatalog/mobile-developer-console-apb/stars/count/)
[![Docker pulls](https://img.shields.io/docker/pulls/aerogearcatalog/mobile-developer-console-apb.svg?style=plastic)](https://registry.hub.docker.com/v2/repositories/aerogearcatalog/mobile-developer-console-apb/)
[![License](https://img.shields.io/:license-Apache2-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Mobile Developer Console

## Try it out

1. Navigate to [Mobile Services Installer repository](https://github.com/aerogear/mobile-services-installer) and follow the instructions for installation of Mobile Services (including Mobile Developer Console) to [existing OpenShift cluster](https://github.com/aerogear/mobile-services-installer#prerequisites) or [to local instance of OpenShift](https://github.com/aerogear/mobile-services-installer#local-development).
2. After installation is finished, navigate to OpenShift Service Catalog and **Mobile** tab, select **Mobile Developer Console** and follow the wizard to provision the Service to your project.
3. When provision is finished, navigate to Mobile Developer Console's URL and login with your OpenShift credentials.

## Development

### Prerequisites

* Golang (1.10)
 * [Dep tool](https://golang.github.io/dep/docs/installation.html)
* [oc tools >= 3.9.0](https://github.com/openshift/origin/releases)
* Nodejs

### Setup

Checkout to $GOPATH/src/github.com/aerogear

```bash
mkdir -v $GOPATH/src/github.com/aerogear
git clone https://github.com/aerogear/mobile-developer-console $GOPATH/src/github.com/aerogear/mobile-developer-console
cd $GOPATH/src/github.com/aerogear/mobile-developer-console
```

```bash
make setup
```

### Build

```bash
# Build the API server
make build
# Build the UI
make ui
```

### Run locally

If you don't have OpenShift running, navigate to [Mobile Services Installer repository](https://github.com/aerogear/mobile-services-installer#local-development) and follow the instructions to spin up local instance of OpenShift.

After your local OpenShift instance is ready, create a new target project
```bash
oc new-project <target-project>
```

Now set the `NAMESPACE` env var to point at the `target-project`
```bash
export NAMESPACE=<target-project>
```

Also set `KUBERNETES_CONFIG` to point to your `.kube/config` which is usually at `$HOME/.kube/config`
```bash
export KUBERNETES_CONFIG=$HOME/.kube/config
```

From root folder of this repository, run 
```
./scripts/development.sh
```
This will start [CORS Anywhere proxy server](https://www.npmjs.com/package/cors-anywhere) (on port 8080), Go backend server (port 4000) and Node development server (port 3000).

When changes are made to `.go` files, current instance of Go server is killed, source files are rebuilt and new instance of Go server is run.
These changes are handled by [realize task runner](https://github.com/oxequa/realize).

Changes to `.js` files are handled by Node server([react-scripts](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-start)).

## Test

### Backend unit tests
```bash
make test
```

### Backend integration tests

1. Build the API Server: `make build`
2. Follow [these instructions](#Run-locally) to target existing OpenShift project (**Note:** the project must not contain existing mobile clients)
3. Provision Metrics service in the OpenShift project that you target
4. Install dependencies: `cd integration_tests && npm install`
5. Run the tests: `npm test`


## Generate the API definition for the CRD

If you are changing the type definition of (MobileClient)[./pkg/apis/aerogear/v1alpha1/types.go], you should run the following command to regenerate some of the files.

Make sure you have the [operator-sdk](https://github.com/operator-framework/operator-sdk) installed locally, and then run

```
 operator-sdk generate k8s
```
