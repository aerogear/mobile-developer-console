#!/usr/bin/env bash

cd "$(dirname "$0")" || exit 1
ASB_PROJECT_NAME=$(oc get projects | grep -e ansible-service-broker -e automation-service-broker | awk '{print $1}')
if [ -z "$ASB_PROJECT_NAME" ]
then
    echo "Ansible service broker project not found."
    exit 1
fi
oc project "$ASB_PROJECT_NAME" || exit 1

# Command-line YAML processor: http://mikefarah.github.io/yq
yq="docker run -v ${PWD}:/workdir mikefarah/yq yq"
# Variables
UPDATE_INSTRUCTIONS="yml/update_instructions.yaml"
AEROGEARCATALOG_REGISTRY="yml/aerogearcatalog_registry.yaml"
ASB_TEMPLATE_FILENAME="_tmp-asb-template.yaml"
ASB_DC_NAME=$(oc get dc -o jsonpath='{.items[*].metadata.name}' -n "$ASB_PROJECT_NAME")

# Mobile CRD (mobileclient)
oc create -f ../deploy/crd.yaml
oc create clusterrole mobileclient-admin --verb=create,delete,get,list,patch,update,watch --resource=mobileclients
oc adm policy add-cluster-role-to-group mobileclient-admin system:authenticated

# ASB configuration
oc get configmap broker-config -n "$ASB_PROJECT_NAME" -o jsonpath='{.data.broker-config}' > $ASB_TEMPLATE_FILENAME
if ! $yq r $ASB_TEMPLATE_FILENAME registry.*.org | grep aerogearcatalog &>/dev/null ; then
    while oc rollout history dc/"$ASB_DC_NAME" -n "$ASB_PROJECT_NAME" | grep Running &>/dev/null
    do
        echo "Waiting for ASB to spin up" && sleep 5
    done
    # Append dockerhub registry target - aerogearcatalog
    $yq m -a -i $ASB_TEMPLATE_FILENAME $AEROGEARCATALOG_REGISTRY
    # Additional changes to broker configuration file
    $yq w -i -s $UPDATE_INSTRUCTIONS $ASB_TEMPLATE_FILENAME
    # Replace double quotes with single quotes
    sed -i.bak -e "s/\"/'/g" $ASB_TEMPLATE_FILENAME
    oc patch configmap broker-config -p "{\"data\":{\"broker-config\": \"$(awk '{printf "%s\\n", $0}' ${ASB_TEMPLATE_FILENAME})\"}}" -n "$ASB_PROJECT_NAME"
    oc rollout latest "$ASB_DC_NAME" -n "$ASB_PROJECT_NAME"
fi
