#!/usr/bin/env bash

cd "$(dirname "$0")"

oc cluster down

if [ -z "${DEFAULT_CLUSTER_IP}" ]; then
    export DEFAULT_CLUSTER_IP=$(ifconfig $(netstat -nr | awk '{if (($1 == "0.0.0.0" || $1 == "default") && $2 != "0.0.0.0" && $2 ~ /[0-9\.]+{4}/){print $NF;} }' | head -n1) | grep 'inet ' | awk '{print $2}')
fi

oc cluster up \
    --public-hostname=$DEFAULT_CLUSTER_IP.nip.io \
    --routing-suffix=$DEFAULT_CLUSTER_IP.nip.io \
    --no-proxy=$DEFAULT_CLUSTER_IP || exit

oc cluster add service-catalog
oc cluster add automation-service-broker
oc cluster add template-service-broker

oc login -u system:admin

export ASB_PROJECT_NAME='openshift-automation-service-broker'

chcon -Rt svirt_sandbox_file_t .

./post_install.sh

export ROUTING_SUFFIX=$DEFAULT_CLUSTER_IP.nip.io
export CONTROLLER_MANAGER_DIR="$(pwd)/openshift.local.clusterup/openshift-controller-manager"

./setup-router-certs.sh
