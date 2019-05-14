#!/bin/bash

# Run this script to deploy MDC to an OpenShift cluster using S2I. 
# Make sure you run `prepare.sh` first.

if [ $# -ne 3 ]; then
    echo 'Must specify openshift host, a namespace & git ref to deploy e.g. ./deploy-image-stream.sh openshift.example.com:8443 development'
    exit 1
fi

echo $@

OPENSHIFT_HOST=$1
NAMESPACE=$2
SOURCE_REPOSITORY_REF=$3
MAIN_TEMPLATE="${MAIN_TEMPLATE:-./mobile-developer-console.template.yaml}"
SOURCE_BUILDING_TEMPLATE="${SOURCE_BUILDING_TEMPLATE-./source-building-template.yml}"
SOURCE_BUILDING_PATCH="${SOURCE_BUILDING_PATCH-./source-building-deploymentconfig-patch.yml}"
TMP_MAIN_TEMPLATE_FILE=/tmp/processed_main_template.yml
TMP_SOURCE_BUILDING_TEMPLATE_FILE=/tmp/processed_source_building_template.yml
OC_CMD="${OC_CMD:-oc}"

$OC_CMD new-project $NAMESPACE
$OC_CMD process -n $NAMESPACE -f $MAIN_TEMPLATE --param=OPENSHIFT_HOST=$OPENSHIFT_HOST > $TMP_MAIN_TEMPLATE_FILE
$OC_CMD create -n $NAMESPACE -f $TMP_MAIN_TEMPLATE_FILE

$OC_CMD process -n $NAMESPACE -f $SOURCE_BUILDING_TEMPLATE --param=SOURCE_REPOSITORY_REF=$SOURCE_REPOSITORY_REF > $TMP_SOURCE_BUILDING_TEMPLATE_FILE
$OC_CMD create -n $NAMESPACE -f $TMP_SOURCE_BUILDING_TEMPLATE_FILE

# Patch the deployment to use the imagestream
$OC_CMD patch -n $NAMESPACE deploymentconfig/mobile-developer-console --patch "$(cat $SOURCE_BUILDING_PATCH)"

MDC_HOST=$($OC_CMD -n $NAMESPACE get route mobile-developer-console --template "{{.spec.host}}")
$OC_CMD patch oauthclient/mobile-developer-console --patch "{\"redirectURIs\":[\"https://$MDC_HOST\"]}"

$OC_CMD start-build -n $NAMESPACE mobile-developer-console
echo "Please also add $MDC_HOST to the \"corsAllowedOrigins\" section of the master config file and then restart the master node."
echo "For more information, please check https://docs.openshift.com/container-platform/3.11/install_config/master_node_configuration.html#master-config-asset-config."