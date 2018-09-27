[![CircleCI](https://circleci.com/gh/aerogear/mobile-developer-console.svg?style=svg)](https://circleci.com/gh/aerogear/mobile-developer-console) [![Coverage Status](https://coveralls.io/repos/github/aerogear/mobile-developer-console/badge.svg?branch=master)](https://coveralls.io/github/aerogear/mobile-developer-console?branch=master)

# Mobile Developer Console

## Prerequisites

* Golang (1.10)
 * [Dep tool](https://golang.github.io/dep/docs/installation.html)
* [oc tools >= 3.9.0](https://github.com/openshift/origin/releases)
* Nodejs

## Setup

Checkout to $GOPATH/src/github.com/aerogear

```bash
mkdir -v $GOPATH/src/github.com/aerogear
git clone https://github.com/aerogear/mobile-developer-console $GOPATH/src/github.com/aerogear/mobile-developer-console
```

```bash
make setup
```

## Build

```bash
# Build the API server
make build
# Build the UI
make ui
```

## Run

### Run locally
If you don't have openshift running
```bash
oc cluster up
```

Create the Mobile Client custom resource definition
```bash
oc create -f deploy/crd.yaml
```

There is an example custom resource template at [deploy/cr.yaml](https://github.com/aerogear/mobile-developer-console/blob/master/deploy/cr.yaml) to create Mobile Client instances.

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

Then
```bash
make serve
```

### Run on OpenShift

```bash
oc project <namespace>
oc process -f mobile-developer-console.template.yaml | oc create -f -
```

For more information on parameters, run:

```bash
oc process -f mobile-developer-console.template.yaml --parameters
```

## Local development

Follow the [steps above](#run-locally)

From root folder of this repository, run `./scripts/development.sh`. This will start [CORS Anywhere proxy server](https://www.npmjs.com/package/cors-anywhere) (on port 8080), Go backend server (port 4000) and Node development server (port 3000).

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

## Running it on local OpenShift

In order to run this service on local OpenShift, please follow the steps below:

1. Provison a local OpenShift cluster using the [provision-mobile-developer-console branch of mobile core](https://github.com/aerogear/mobile-core/tree/provision-mobile-developer-console). The only difference between this branch and the master is that this branch uses the stock web console image.
2. Once the local OpenShift cluster is up and running, update the config of the ansible-service-broker to load APBs from an extra source by running the following commands:
    
    ```
    oc edit configmap broker-config -n ansible-service-broker
    ```

    Find the `registry` section and add the following content to the list:

    ```
    - type: "dockerhub"
      name: "aerogear"
      url: "https://registry.hub.docker.com"
      org: "aerogear"
      tag: "latest"
      white_list:
        - ".*-apb$"
    ```

    Also please change the `tag` field of the existing `aerogearcatalog` registry to `1.0.0`.

    Save the file, and then refresh the ansible service broker by running the following commands:

    ```
    oc rollout latest asb -n ansible-service-broker
    # wait for a new pod to be deployed, then run
    oc get clusterservicebroker ansible-service-broker -o=json > /tmp/broker.json
    oc delete clusterservicebroker ansible-service-broker
    oc create -f /tmp/broker.json
    ```

    At last, refresh the catalog and you should see there is a new `Mobile Developer Console` available.
3. Provision a new service from the catalog and go from there.



