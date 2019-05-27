#!/bin/bash

# Run this script to deploy an existing MDC image to an OpenShift cluster. 
# Make sure you run `../scripts/prepare.sh` first.
cd "$(dirname "$0")" || exit 1

if [ $# -ne 2 ]; then
    echo 'Must specify openshift host and a namespace to deploy e.g. ./deploy-image.sh openshift.example.com:8443 webapp-test-001'
    exit 1
fi

echo $@

OPENSHIFT_HOST=$1
NAMESPACE=$2
MAIN_TEMPLATE="${MAIN_TEMPLATE:-./mobile-developer-console.template.yaml}"
TMP_MAIN_TEMPLATE_FILE=/tmp/processed_main_template.yml
OC_CMD="${OC_CMD:-oc}"

$OC_CMD new-project $NAMESPACE
$OC_CMD process -n $NAMESPACE -f $MAIN_TEMPLATE --param=OPENSHIFT_HOST=$OPENSHIFT_HOST > $TMP_MAIN_TEMPLATE_FILE
$OC_CMD create -n $NAMESPACE -f $TMP_MAIN_TEMPLATE_FILE

MDC_HOST=$($OC_CMD -n $NAMESPACE get route mobile-developer-console --template "{{.spec.host}}")
$OC_CMD patch oauthclient/mobile-developer-console --patch "{\"redirectURIs\":[\"https://$MDC_HOST\"]}"

echo "Mobile developer console url: https://$MDC_HOST"
echo "You may also need to add $MDC_HOST to the \"corsAllowedOrigins\" section of the master config file and then restart the master node if you are running against a remote cluster."
echo "For more information, please check https://docs.openshift.com/container-platform/3.11/install_config/master_node_configuration.html#master-config-asset-config."