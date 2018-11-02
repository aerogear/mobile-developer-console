#!/usr/bin/env bash

cd "$(dirname "$0")"

oc cluster down

export DEFAULT_CLUSTER_IP=$(ifconfig $(netstat -nr | awk '{if (($1 == "0.0.0.0" || $1 == "default") && $2 != "0.0.0.0" && $2 ~ /[0-9\.]+{4}/){print $NF;} }' | head -n1) | grep 'inet ' | awk '{print $2}')

oc cluster up --public-hostname=$DEFAULT_CLUSTER_IP.nip.io --routing-suffix=$DEFAULT_CLUSTER_IP.nip.io \
--enable=*,service-catalog,automation-service-broker,template-service-broker

oc login -u system:admin

export ROUTING_SUFFIX=$DEFAULT_CLUSTER_IP.nip.io

./setup-router-certs.sh

export ASB_PROJECT_NAME='openshift-automation-service-broker'

./post_install.sh

echo
echo "*******************"
echo "Cluster certificate is located in /tmp/mini-certs/localcluster.crt. Install it to your mobile device."