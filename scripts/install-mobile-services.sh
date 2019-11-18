#!/bin/sh

# Set MDC namespace
export NAMESPACE=${NAMESPACE:-mobile-console}
kubectl create namespace $NAMESPACE

#################
## Install UPS ##
#################

# prepare cluster
kubectl create namespace unifiedpush
kubectl label namespace unifiedpush monitoring-key=middleware
kubectl apply -n unifiedpush -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/service_account.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/role.yaml
kubectl apply -n unifiedpush -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/role_binding.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/crds/push_v1alpha1_unifiedpushserver_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/crds/push_v1alpha1_pushapplication_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/crds/push_v1alpha1_androidvariant_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/crds/push_v1alpha1_iosvariant_crd.yaml

# Deploy UPS operator
cat <<EOF | kubectl apply -n unifiedpush -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: unifiedpush-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      name: unifiedpush-operator
  template:
    metadata:
      labels:
        name: unifiedpush-operator
    spec:
      serviceAccountName: unifiedpush-operator
      containers:
        - name: unifiedpush-operator
          image: quay.io/aerogear/unifiedpush-operator:master
          command:
          - unifiedpush-operator
          imagePullPolicy: Always
          env:
            - name: WATCH_NAMESPACE
              value: ""
            - name: APP_NAMESPACES
              value: $NAMESPACE
            - name: SERVICE_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: OPERATOR_NAME
              value: "unifiedpush-operator"
EOF

# install UPS application
kubectl apply -n unifiedpush -f https://raw.githubusercontent.com/aerogear/unifiedpush-operator/master/deploy/crds/push_v1alpha1_unifiedpushserver_cr.yaml


#####################################
## Install Mobile Security Service ##
#####################################

oc new-project mobile-security-service
kubectl label namespace mobile-security-service monitoring-key=middleware
kubectl create namespace $NAMESPACE
kubectl apply -n mobile-security-service -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/cluster_role.yaml
kubectl apply -n mobile-security-service -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/cluster_role_binding.yaml
kubectl apply -n mobile-security-service -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/service_account.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/crds/mobile-security-service_v1alpha1_mobilesecurityservice_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/crds/mobile-security-service_v1alpha1_mobilesecurityservicedb_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/crds/mobile-security-service_v1alpha1_mobilesecurityserviceapp_crd.yaml
kubectl apply -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/crds/mobile-security-service_v1alpha1_mobilesecurityservicebackup_crd.yaml

# Deploy Mobile Security Service operator
cat <<EOF | kubectl apply -n mobile-security-service -f -
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mobile-security-service-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      name: mobile-security-service-operator
  template:
    metadata:
      labels:
        name: mobile-security-service-operator
    spec:
      serviceAccountName: mobile-security-service-operator
      containers:
        - name: mobile-security-service-operator
          # Replace this with the built image name
          image: quay.io/aerogear/mobile-security-service-operator:master
          command:
          - mobile-security-service-operator
          imagePullPolicy: Always
          env:
            - name: WATCH_NAMESPACE
              valueFrom:
                fieldRef:
                  fieldPath: metadata.namespace
            - name: APP_NAMESPACES
              value: $NAMESPACE
            - name: POD_NAME
              valueFrom:
                fieldRef:
                  fieldPath: metadata.name
            - name: OPERATOR_NAME
              value: "mobile-security-service-operator"
EOF

# install Mobile Security Service
kubectl apply -n mobile-security-service -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/crds/mobile-security-service_v1alpha1_mobilesecurityservice_cr.yaml
kubectl apply -n mobile-security-service -f https://raw.githubusercontent.com/aerogear/mobile-security-service-operator/master/deploy/crds/mobile-security-service_v1alpha1_mobilesecurityservicedb_cr.yaml