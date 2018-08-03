#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

vendor/k8s.io/code-generator/generate-groups.sh \
deepcopy \
github.com/aerogear/mobile-client-service/pkg/generated \
github.com/aerogear/mobile-client-service/pkg/apis \
aerogear:v1alpha1 \
--go-header-file "./tmp/codegen/boilerplate.go.txt"
