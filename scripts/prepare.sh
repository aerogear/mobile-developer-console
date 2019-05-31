#!/bin/bash

cd "$(dirname "$0")" || exit 1

# You only need to run this script once to setup a cluster
NAMESPACE="${NAMESPACE:-mobile-console}"
MOBILE_CLIENT_CRD="${MOBILE_CLIENT_CRD:-../deploy/mobile-client-crd.yaml}"
OAUTH_CLIENT_FILE="${OAUTH_CLIENT_FILE:-../deploy/openshift-oauthclient.yaml}"
OC_CMD="${OC_CMD:-oc}"

echo "Create project ${NAMESPACE}"
$OC_CMD new-project ${NAMESPACE}

echo "Setup mobile client CRD"
$OC_CMD create -f ${MOBILE_CLIENT_CRD}
$OC_CMD create clusterrole mobileclient-admin --verb=create,delete,get,list,patch,update,watch --resource=mobileclients
$OC_CMD adm policy add-cluster-role-to-group mobileclient-admin system:authenticated
$OC_CMD create -f ${OAUTH_CLIENT_FILE}

KC_CRD="${KC_CRD:-../deploy/services/keycloak/keycloak-crd.yaml}"
KC_REALM_CRD="${KC_REALM_CRD:-../deploy/services/keycloak/keycloak-realm-crd.yaml}"
KC_OPERATOR_TEMPLATE="${KC_OPERATOR_TEMPLATE:-../deploy/services/keycloak/operator.yaml}"
KC_ROLE_TEMPLATE="${KC_ROLE_TEMPLATE:-../deploy/services/keycloak/rbac.yaml}"
KC_INSTALL_TEMPLATE="${KC_INSTALL_TEMPLATE:-../deploy/services/keycloak/install.yaml}"

echo "Setup Keycloak service"
$OC_CMD create -f ${KC_CRD}
$OC_CMD create -f ${KC_REALM_CRD}
$OC_CMD create -f ${KC_OPERATOR_TEMPLATE} -n ${NAMESPACE}
$OC_CMD create -f ${KC_ROLE_TEMPLATE} -n ${NAMESPACE}
$OC_CMD create -f ${KC_INSTALL_TEMPLATE} -n ${NAMESPACE}

export NAMESPACE=${NAMESPACE}