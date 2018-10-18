#!/usr/bin/env bash

oc cluster down && oc cluster up || exit
oc login -u system:admin
oc create -f deploy/crd.yaml
oc create clusterrole mobileclient-admin --verb=create,delete,get,list,patch,update,watch --resource=mobileclients
oc adm policy add-cluster-role-to-group mobileclient-admin system:authenticated
oc login -u developer

if [ "$1" != "development" ]; then
    oc process -f mobile-developer-console.template.yaml | oc create -f -
fi
