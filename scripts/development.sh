#!/bin/bash

if [ -z "$1" ]; then
    go get github.com/oxequa/realize
    node ui/util/cors-server.js &
    cd ui && npm start &
    realize start
fi

if [ "$1" == "go-server" ]; then
    ./mobile-client-service -kubeconfig ~/.kube/config
fi

if [ "$1" == "kill-go-server" ]; then
    pkill mobile-client-service
fi
