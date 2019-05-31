#!/bin/bash

# Start a minishift instance and setup the right permission to the "developer" user
cd "$(dirname "$0")" || exit 1

minishift start || exit 1

oc login -u system:admin --insecure-skip-tls-verify=true $(minishift ip):8443
oc adm policy add-cluster-role-to-user cluster-admin developer

if minishift addons list | grep cors ; then
    minishift addons apply cors
else
    MINISHIFT_ADDONS_PATH=/tmp/minishift-addons
    rm -rf $MINISHIFT_ADDONS_PATH && git clone https://github.com/minishift/minishift-addons.git $MINISHIFT_ADDONS_PATH
    # Not needed after https://github.com/minishift/minishift-addons/pull/187 is merged
    cd $MINISHIFT_ADDONS_PATH
    git fetch origin pull/187/head:cors-fix && git checkout cors-fix
    minishift addons install /tmp/minishift-addons/add-ons/cors
    minishift addons apply cors
fi