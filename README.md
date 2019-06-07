[![CircleCI](https://circleci.com/gh/aerogear/mobile-developer-console.svg?style=svg)](https://circleci.com/gh/aerogear/mobile-developer-console)
[![License](https://img.shields.io/:license-Apache2-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Mobile Developer Console

## Try it out

### Local Cluster

1. Make sure you have the latest version of [Minishift](https://github.com/minishift/minishift) installed.
2. Run the following commands:
    ```
    ./scripts/minishift_start.sh
    ./scripts/prepare.sh
    ./deploy/deploy-image.sh $(minishift ip):8443 mobile
    ```
3. Open the mobile developer console URL printed by the script.

### Remote Cluster

1. Make sure you have `oc` CLI installed and logged into the remote cluster as a cluster-admin user.
    ```
    oc login <openshift-url>
    ```
2. Export `NAMESPACE` and `OPENSHIFT_HOST` variables and run [`prepare.sh`](scripts/prepare.sh) script:
   ```
   export NAMESPACE="<your-project-name>"
   export OPENSHIFT_HOST="<your-openshift-host>"
   ./scripts/prepare.sh
   ```
3. Deploy the service using one of the following commands:
   ```
   # Deploy the latest image
   ./deploy/deploy-image.sh $OPENSHIFT_HOST $NAMESPACE

   # OR deploy the service using S2I
   ./deploy/deploy-image-stream.sh $OPENSHIFT_HOST $NAMESPACE <git-ref>
   ```
4. [Enable CORS](#enable-cors-in-the-openshift-cluster)

## Development

### Prerequisites

* Nodejs >= 10
* An OpenShift cluster. You can either use a local cluster, or a remote cluster.

### Local OpenShift Cluster

It is recommended to use the latest release of [Minishift](https://github.com/minishift/minishift) to run the local cluster. Make sure you have it installed and then run the following commands to start development locally:

```console
./scripts/minishift_start.sh
./scripts/prepare.sh
./scripts/development.sh # You can add "--skip-npm-install" argument if you want to skip installation of node modules
```

### Remote OpenShift Cluster

If you are using a remote cluster, make sure you have `oc` CLI installed locally and login to the remote cluster. You will need a user that has `cluster-admin` permission.

```
oc login <openshift-url>
```

then you need to run the prepare script:

```
./scripts/prepare.sh
```

and start the development server:

```
export OPENSHIFT_HOST=<openshift-hostname>
export OPENSHIFT_USER_TOKEN=$(oc whoami -t)
npm run start:server &
npm run start:client
```

This will start the MDC in development mode, and you should see the console opened inside a browser tab. It will watch local files and the browser tab will be refreshed automatically whenever changes are made inside the `./src` directory. 

### Enable CORS in the OpenShift cluster

The mobile developer console will need to talk to the OpenShift API server directly. However, the requests will likely to be blocked by the browser due to [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) restrictions.

To fix this, you will need to manually update the OpenShift master configuration to allow CORS requests from the mobile developer console.

If you are using Minishift, you should use the [CORS addon](https://github.com/minishift/minishift-addons/tree/master/add-ons/cors). Installation of this plugin is automated in [`./scripts/minishift_start.sh`](scripts/minishift_start.sh).

If you are using a remote cluster, you should check [OpenShift configuration guide](https://docs.openshift.com/container-platform/3.11/install_config/master_node_configuration.html#master-config-asset-config) on how to update the CORS configurations.

## Build

```bash
make build
```

## Test

### Unit tests
```bash
make test
```

## Release

Create a new Git tag and the CI job will automatically push the built image to [quay.io](https://quay.io/repository/aerogear/mobile-developer-console?tab=tags).

<!-- ### Backend integration tests

1. Build the API Server: `make build`
2. Follow [these instructions](#Run-locally) to target existing OpenShift project (**Note:** the project must not contain existing mobile clients)
3. Provision Metrics service in the OpenShift project that you target
4. Install dependencies: `cd integration_tests && npm install`
5. Run the tests: `npm test` -->
