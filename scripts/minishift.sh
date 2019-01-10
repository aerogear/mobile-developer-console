#!/usr/bin/env bash

cd "$(dirname "$0")" || exit 1

# If docker isn't running we'll run into issues later using "yq"
# Checking the version is a simple way to determine if the daemon is running
docker version &> /dev/null

docker_status=$?

if [ $docker_status -ne 0 ]
then
    echo "Error: verify docker is installed and active";
    exit 1
fi

minishift delete -f

MINISHIFT_ENABLE_EXPERIMENTAL=y minishift start --openshift-version v3.11.0 \
--extra-clusterup-flags "--enable=*,service-catalog,automation-service-broker,template-service-broker" || exit 1

oc login -u system:admin

./post_install.sh

export ROUTING_SUFFIX=$(minishift ip).nip.io
export MINISHIFT=true

./setup-router-certs.sh
