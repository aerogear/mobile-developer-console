[![CircleCI](https://circleci.com/gh/aerogear/mobile-client-service.svg?style=svg)](https://circleci.com/gh/aerogear/mobile-client-service) [![Coverage Status](https://coveralls.io/repos/github/aerogear/mobile-client-service/badge.svg?branch=master)](https://coveralls.io/github/aerogear/mobile-client-service?branch=master)

# Mobile Client Service

## Prerequisites

* Golang (1.10)
 * [Dep tool](https://golang.github.io/dep/docs/installation.html)
* [oc tools >= 3.9.0](https://github.com/openshift/origin/releases)
* Nodejs

## Setup

Checkout to $GOPATH/src/github.com/aerogear

```bash
mkdir -v $GOPATH/src/github.com/aerogear
git clone https://github.com/aerogear/mobile-client-service $GOPATH/src/github.com/aerogear/mobile-client-service
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

There is an example custom resource template at [deploy/cr.yaml](https://github.com/aerogear/mobile-client-service/blob/master/deploy/cr.yaml) to create Mobile Client instances.

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
oc process -f mobile-client-service.template.yaml | oc create -f -
```

For more information on parameters, run:

```bash
oc process -f mobile-client-service.template.yaml --parameters
```

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
