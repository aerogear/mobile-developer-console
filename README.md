[![CircleCI](https://circleci.com/gh/aerogear/mobile-developer-console.svg?style=svg)](https://circleci.com/gh/aerogear/mobile-developer-console) [![Coverage Status](https://coveralls.io/repos/github/aerogear/mobile-developer-console/badge.svg?branch=master)](https://coveralls.io/github/aerogear/mobile-developer-console?branch=master)
[![](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/aerogearcatalog/mobile-developer-console-apb/)
[![Docker Stars](https://img.shields.io/docker/stars/aerogearcatalog/mobile-developer-console-apb.svg?style=plastic)](https://registry.hub.docker.com/v2/repositories/aerogearcatalog/mobile-developer-console-apb/stars/count/)
[![Docker pulls](https://img.shields.io/docker/pulls/aerogearcatalog/mobile-developer-console-apb.svg?style=plastic)](https://registry.hub.docker.com/v2/repositories/aerogearcatalog/mobile-developer-console-apb/)
[![License](https://img.shields.io/:license-Apache2-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Mobile Developer Console

## Try it out

### oc cluster up

(To check the UI and try out basic operations - creating/deleting Mobile Clients/Apps)

1. Clone this repo 

```
git clone https://github.com/aerogear/mobile-developer-console && cd mobile-developer-console
```
2. Run the script
```
./scripts/mdc-oc-cluster-up.sh
```
3. Navigate to `https://127.0.0.1:8443/console/project/myproject/overview`
4. Log in with user `developer` (developer/123)
5. Follow the link to mobile-developer-console

### Full experience (Use APB to deploy mobile-developer-console)

1. Use [Mobile Core installer](https://github.com/aerogear/mobile-core) to run `oc cluster up` with
all required configuration to deploy the mobile-developer-console from APB.
You can follow the docs [here](https://github.com/aerogear/mobile-core)
2. After your local OpenShift cluster is running, you can navigate to your project in OpenShift console and search for `Mobile Developer Console` in the catalog.
3. Follow the wizard to provision Mobile Developer Console APB to your project
4. Repeat steps 2 & 3 for `Mobile CI/CD` APB 
5. Once both APBs are provisioned (provisioning of `Mobile CI/CD` will take couple of minutes), navigate the link to mobile-developer-console and log in as `developer`


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
If you don't have OpenShift running
```bash
./scripts/mdc-oc-cluster-up.yml development
```

Create a new target project
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

```bash
make test
```

## Generate the API definition for the CRD

If you are changing the type definition of (MobileClient)[./pkg/apis/aerogear/v1alpha1/types.go], you should run the following command to regenerate some of the files.

Make sure you have the [operator-sdk](https://github.com/operator-framework/operator-sdk) installed locally, and then run

```
 operator-sdk generate k8s
```
