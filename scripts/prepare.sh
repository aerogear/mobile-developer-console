#!/bin/bash

cd "$(dirname "$0")" || exit 1

# You only need to run this script once to setup a cluster
MOBILE_CLIENT_CRD="${MOBILE_CLIENT_CRD:-../deploy/mobile-client-crd.yaml}"
OAUTH_CLIENT_FILE="${OAUTH_CLIENT_FILE:-../deploy/openshift-oauthclient.yaml}"
OC_CMD="${OC_CMD:-oc}"

$OC_CMD create -f ${MOBILE_CLIENT_CRD}
$OC_CMD create clusterrole mobileclient-admin --verb=create,delete,get,list,patch,update,watch --resource=mobileclients
$OC_CMD adm policy add-cluster-role-to-group mobileclient-admin system:authenticated
$OC_CMD create -f ${OAUTH_CLIENT_FILE}