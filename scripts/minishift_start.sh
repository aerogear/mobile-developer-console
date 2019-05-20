#!/bin/bash

# Start a minishift instance and setup the right permission to the "developer" user
cd "$(dirname "$0")" || exit 1

minishift start || exit 1

oc login -u system:admin --insecure-skip-tls-verify=true $(minishift ip):8443
oc adm policy add-cluster-role-to-user cluster-admin developer